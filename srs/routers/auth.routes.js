const router = require("express").Router();
const { loginValidation, signupValidation } = require("../middleware/userValidation");
const { tokenMiddelware } = require("../middleware/tokenMiddelware");
const user = require("../controllers/user");

router.post("/signup", signupValidation, user.addNewUser);

router.post("/login", loginValidation, user.userLogin);

router.get("/", tokenMiddelware, user.getCurentUser);

router.get("/logout", tokenMiddelware, user.logOutUser);

module.exports = router;
