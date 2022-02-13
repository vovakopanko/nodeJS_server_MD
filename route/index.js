const Router = require("express").Router;
const router = new Router(); // create new object , with listen our HTTP request (CRUD)
const controller = require("../controllers/user-controller");
const { body } = require("express-validator");

router.post(
  "/signup",
  body("email").isEmail(),
  body("password").isLength({ min: 5, max: 40 }),
  controller.registration
); //registration
router.put("/signin", controller.login); //authorization
router.get("/logout", controller.logout);
router.get("/activate/:link", controller.activate);
router.get("/refresh", controller.refresh);
// router.post('/addPost', authMiddleware, controller.addPost)
// router.post('/deletePost', authMiddleware, controller.delete)

module.exports = router;
