const UserModel = require("../models/User");
const mailService = require("../service/mail-service");
const tokenService = require("./token-service");
const UserDto = require("../dtos/userDto");
const ApiError = require("../exceptions/api-error");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");

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
    await mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/auth/activate/${activationLink}`
    );

    const userDto = new UserDto(user); // email , id ,isActivated
    const tokens = tokenService.generateToken({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken); // id users and refreshToken, witch we generated late

    return {
      ...tokens, // return access token and refresh token
      user: userDto,
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
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest("Invalid username or password");
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
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