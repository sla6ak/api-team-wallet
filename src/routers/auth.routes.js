const router = require("express").Router();
const {
  loginValidation,
  signupValidation,
} = require("../middleware/userValidation");
const { authenticate } = require("../middleware");
const user = require("../controllers/user");

router.post("/signup", signupValidation, user.addNewUser);

router.post("/login", loginValidation, user.userLogin);

router.get("/current", authenticate, user.getCurrentUser);

router.post("/logout", authenticate, user.logOutUser);

router.get("/verify", user.resendVerifyEmail);

router.patch("/verify/:verificationToken", user.verifyEmail);

router.delete("/delete", authenticate, user.delete);

module.exports = router;
