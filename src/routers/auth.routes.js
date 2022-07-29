const router = require("express").Router();
const {
  loginValidation,
  signupValidation,
} = require("../middleware/userValidation");
const { tokenMiddleware } = require("../middleware/tokenMiddleware");
const user = require("../controllers/user");

router.post("/signup", signupValidation, user.addNewUser);

router.post("/login", loginValidation, user.userLogin);

router.get("/", tokenMiddleware, user.getCurrentUser);

router.get("/logout", tokenMiddleware, user.logOutUser);

module.exports = router;
