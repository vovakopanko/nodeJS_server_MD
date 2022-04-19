const Router = require("express").Router;
const multer = require("multer");
const router = new Router(); // create new object , with listen our HTTP request (CRUD)
const controller = require("../controllers/user-controller");
const { body } = require("express-validator");
const ImageModel = require("../models/Image");

//Storage

const Storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: Storage,
}).single("testImage");

router.post(
  "/signup",
  body("email").isEmail(),
  body("password").isLength({ min: 5, max: 40 }),
  controller.registration
); //registration
router.put("/signIn", controller.login); //authorization
router.get("/logout", controller.logout);
router.get("/activate/:link", controller.activate);
router.get("/refresh", controller.refresh);
router.get("/users", controller.getUsers);
router.get("/gameCards", controller.getGameCards);
router.get("/categories", controller.getCategories);
router.get("/logoGames", controller.getLogoGames);
router.post(
  "/change-password",
  body("email").isEmail(),
  body("password").isLength({ min: 5, max: 40 }),
  body("currentPassword"),
  controller.changeUserPassword
);
router.post(
  "/update-profile-info",
  body("email"),
  body("userName"),
  body("description"),
  body("address"),
  body("phoneNumber"),
  controller.changeUserInfo
);
router.post(
  "/update-profile-avatar",
  body("photoUser"),
  controller.changeUserAvatar
);
router.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
    } else {
      const newImage = new ImageModel({
        name: req.body.name,
        image: {
          data: req.file.filename,
          contentType: "image/png",
        },
      });
      newImage
        .save()
        .then(() => res.send("successfully uploaded"))
        .catch((err) => console.log(err));
    }
  });
});
// router.post('/addPost', authMiddleware, controller.addPost)
// router.post('/deletePost', authMiddleware, controller.delete)

module.exports = router;
