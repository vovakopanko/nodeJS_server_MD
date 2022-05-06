const userService = require("../service/user-service");
const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/api-error");
const GameCardsModel = require("../models/GameCards");
class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Validation error ", errors.array()));
      }
      const { email, password } = req.body;
      const userData = await userService.registration(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true, // can't change cookies inside the browser
      }); // add refreshToken in data cookie ( working with index.js app.use(cookieParser()))
      return res.json(userData);
    } catch (e) {
      next(e); // app.use(errorMiddleware) calls the next in the chain middleware
    }
  }

  async changeUserPassword(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Validation error ", errors.array()));
      }
      const { email, password, currentPassword } = req.body;
      const userData = await userService.changePassword(
        email,
        password,
        currentPassword
      );
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true, // can't change cookies inside the browser
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async changeUserInfo(req, res, next) {
    try {
      const { email, userName, description, address, phoneNumber } = req.body;
      const userData = await userService.changeAllUserInfo(
        email,
        userName,
        description,
        address,
        phoneNumber
      );
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async deleteCardInfo(req, res, next) {
    try {
      const { uniqueId } = req.body;
      const card = await userService.deleteGameCard(uniqueId);
      return res.json(uniqueId);
    } catch (e) {
      next(e);
    }
  }

  async createNewCard(req, res, next) {
    try {
      const {
        title,
        alt,
        description,
        url,
        amountStars,
        price,
        genres,
        age,
        imagePlatforms,
        uniqueId,
      } = req.body;
      const cardData = await userService.createGameCardInfo(
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
      );
      return res.json(cardData);
    } catch (e) {
      next(e);
    }
  }

  async changeCardInfo(req, res, next) {
    try {
      const {
        title,
        alt,
        description,
        url,
        amountStars,
        price,
        genres,
        age,
        imagePlatforms,
        uniqueId,
      } = req.body;
      const cardData = await userService.changeGameCardInfo(
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
      );
      return res.json(cardData);
    } catch (e) {
      next(e);
    }
  }

  async changeUserAvatar(req, res, next) {
    try {
      const { email, photoUser } = req.body;
      const userData = await userService.changePhotoUser(email, photoUser);
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e); // app.use(errorMiddleware) calls the next in the chain middleware
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie("refreshToken"); // clear cookies, deletions from storage refreshToken
      return res.json(token);
    } catch (e) {
      next(e); // app.use(errorMiddleware) calls the next in the chain middleware
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL);
    } catch (e) {
      next(e); // app.use(errorMiddleware) calls the next in the chain middleware
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }

  async getCategories(req, res, next) {
    try {
      const users = await userService.getAllCategories();
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }

  async getGameCards(req, res, next) {
    const { age, genres } = req.query;
    let filter;
    try {
      if (genres && age) {
        filter = await GameCardsModel.find({
          age: age,
          genres: genres,
        });
      }
      if (!genres && !age) {
        filter = await userService.getAllGameCards();
      }
      if (genres && !age) {
        filter = await GameCardsModel.find({ genres: genres });
      }
      if (!genres && age) {
        filter = await GameCardsModel.find({ age: age });
      }
      return res.json(filter);
    } catch (e) {
      next(e);
    }
  }

  async getLogoGames(req, res, next) {
    try {
      const logoGames = await userService.getAllLogoGames();
      return res.json(logoGames);
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();
