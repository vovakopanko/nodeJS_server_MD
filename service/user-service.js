const UserModel = require("../models/User");
const GameCardsModel = require("../models/GameCards");
const LogoGamesModel = require("../models/LogoGames");
const mailService = require("../service/mail-service");
const tokenService = require("./token-service");
const UserDto = require("../dtos/userDto");
const ApiError = require("../exceptions/api-error");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const CategoriesModel = require("../models/Categories");
const e = require("express");
const GameCards = require("../models/GameCards");
const GameDto = require("../dtos/gameDto");

class UserService {
  async registration(email, password) {
    const candidate = await UserModel.findOne({ email }); //await response
    if (candidate) {
      throw ApiError.BadRequest(`User with such an address ${email} exists!`); // if there is a candidate with this email in bd return true
    }
    const hashPassword = await bcrypt.hash(password, 3); // hash password for hide original password
    const activationLink = uuid.v4();

    const user = await UserModel.create({
      email,
      password: hashPassword,
      activationLink,
    });

    // await mailService.sendActivationMail(
    //   email,
    //   `${process.env.API_URL}/api/auth/activate/${activationLink}`
    // );

    const userDto = new UserDto(user); // email , id ,isActivated
    const tokens = tokenService.generateToken({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken); // id users and refreshToken, witch we generated late

    return {
      ...tokens, // return access token and refresh token
      hashPassword,
      user: userDto,
    };
  }

  async changePassword(email, password, currentPassword) {
    const candidate = await UserModel.findOne({ email }); //await response
    // const currentPasswordUser = await bcrypt.hash(currentPassword, 3);
    if (!candidate) {
      throw ApiError.BadRequest(
        `User with such an address ${email} doesn't exists!`
      );
    }
    const passwordComparison = await bcrypt.compare(
      currentPassword,
      candidate.password
    );
    if (passwordComparison) {
      const hashPassword = await bcrypt.hash(password, 3);
      candidate.password = hashPassword;
      await candidate.save();
    } else {
      throw ApiError.BadRequest(`Invalid current password!`);
    }

    return {
      candidate: candidate,
    };
  }

  async changeAllUserInfo(email, userName, description, address, phoneNumber) {
    const candidate = await UserModel.findOne({ email }); //await response
    if (!candidate) {
      throw ApiError.BadRequest(
        `User with such an address ${email} doesn't exists!`
      );
    }

    candidate.profileDescription = description;
    candidate.address = address;
    candidate.userName = userName;
    candidate.phoneNumber = phoneNumber;

    await candidate.save();
    return {
      candidate,
      userName: candidate.userName,
      phoneNumber: candidate.phoneNumber,
    };
  }

  async deleteGameCard(uniqueId) {
    const card = await GameCards.findOne({ uniqueId });
    if (!card) {
      throw ApiError.BadRequest(`Card with ${uniqueId} doesn't exists!`);
    }
    await card.delete();
    return {
      card,
    };
  }

  async createGameCardInfo(
    title,
    alt,
    description,
    url,
    amountStars,
    price,
    genres,
    age,
    imagePlatforms,
    uniqueId
  ) {
    // const game = await GameCards.findOne({ title });
    // if (game) {
    //   throw ApiError.BadRequest(`Card with such an ${title} exists!`);
    // }

    const id = await GameCards.findOne({ uniqueId });
    if (id) {
      throw ApiError.BadRequest(
        `Card with such an title ${uniqueId} doesn't exists!`
      );
    }

    const newGame = await GameCards.create({
      title,
      price,
      url,
      alt,
      amountStars,
      age,
      description,
      genres,
      imagePlatforms,
      uniqueId,
    });

    const gameDto = new GameDto(newGame);

    return {
      newGame: gameDto,
    };
  }

  async changeGameCardInfo(
    title,
    alt,
    description,
    url,
    amountStars,
    price,
    genres,
    age,
    imagePlatforms,
    uniqueId
  ) {
    const card = await GameCards.findOne({ uniqueId }); //await response
    if (!card) {
      throw ApiError.BadRequest(
        `Card with such an title ${uniqueId} doesn't exists!`
      );
    }

    card.title = title;
    card.price = price;
    card.url = url;
    card.alt = alt;
    card.amountStars = amountStars;
    card.age = age;
    card.description = description;
    card.genres = genres;
    card.imagePlatforms = imagePlatforms;
    card.uniqueId = uniqueId;

    await card.save();
    return {
      card,
    };
  }

  async changePhotoUser(email, photoUser) {
    const candidate = await UserModel.findOne({ email }); //await response
    if (!candidate) {
      throw ApiError.BadRequest(
        `User with such an address ${email} doesn't exists!`
      );
    }
    candidate.photoUser = photoUser;
    await candidate.save();
    return {
      photoUser: candidate.photoUser,
    };
  }

  async activate(activationLink) {
    const user = await UserModel.findOne({ activationLink });
    if (!user) {
      throw ApiError.BadRequest(
        "Don't correctly link for registration your mail account"
      );
    }
    user.isActivated = true;
    await user.save();
  }

  async login(email, password) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest(`User ${email} is not registered`);
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest("Invalid username or password");
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto, password: hashPassword };
  }

  async getAllUsers() {
    const users = await UserModel.find();
    return users;
  }

  async getAllGameCards() {
    const gameCards = await GameCardsModel.find();
    return gameCards;
  }

  async getAllCategories() {
    const categories = await CategoriesModel.find();
    return categories;
  }

  async getAllLogoGames() {
    const categories = await LogoGamesModel.find();
    return categories;
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = await tokenService.validateRefreshToken(refreshToken);
    const tokenFromDataBase = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDataBase) {
      throw ApiError.UnauthorizedError();
    }
    const user = await UserModel.findById(userData.id);
    const userDto = new UserDto(user); // email , id ,isActivated
    const tokens = tokenService.generateToken({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken); // id users and refreshToken, witch we generated late

    return {
      ...tokens, // return access token and refresh token
      user: userDto,
    };
  }
}

module.exports = new UserService();
