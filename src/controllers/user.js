const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createError, defaultResponseData } = require("../helpers");
// const idGeneration = require("bson-objectid");
// const { sendMail, sgMailData } = require("../helpers");

const dotenv = require("dotenv");
dotenv.config();
const { JWT_SECRET_KEY } = process.env;

class User {
  async addNewUser(req, res, next) {
    const { email, password } = req.body;
    try {
      const duplicateEmail = await UserModel.findOne({ email: email });
      if (duplicateEmail) {
        throw createError(409, "User not created. Email is duplicate");
      }

      const hashPassword = await bcrypt.hash(password, 12);
      // const verificationToken = idGeneration();
      // await sendMail(sgMailData(token, email), next);

      const user = await UserModel.create({
        ...req.body,
        password: hashPassword,
        // verificationToken,
      });

      const data = { ...defaultResponseData(), user };
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async userLogin(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email });

      if (!user) {
        throw createError(401, `Email or password is wrong`);
      }

      // if (!user.verify) {
      //  throw createError(401, `User ${email} not verify`);
      // }

      const isPassword = await bcrypt.compare(password, user.password);

      if (!isPassword) {
        throw createError(401, `Email or password is wrong`);
      }

      const token = jwt.sign({ id: user._id }, JWT_SECRET_KEY, {
        expiresIn: "30d",
      });

      const result = await UserModel.findByIdAndUpdate(user._id, { token });
      console.log(result);

      const data = { ...defaultResponseData(), user, token };
      return res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async getCurrentUser(req, res, next) {
    try {
      const { email } = req.user;
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw createError(404);
      }
      const data = { ...defaultResponseData(), user };
      return res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async logOutUser(req, res, next) {
    try {
      const { _id } = req.user;
      const user = await UserModel.findByIdAndUpdate(_id, { token: "" });
      if (!user) {
        throw createError(404);
      }
      return res.status(204);
    } catch (error) {
      next(error);
    }
  }

  async verifyUser(req, res, next) {
    try {
      //   const user = await UserModel.findOne({ verificationToken: req.params.verificationToken });
      //   if (!user) {
      //     return res.status(404).json({ message: `User not found`, response: null });
      //   }
      //   const token = jwt.sign({ id: user._id }, PASSWORD_KEY, { expiresIn: "30d" }); // в качестве ключа возьму id пользователя
      //   const userVerification = await UserModel.findOneAndUpdate(
      //     { verificationToken: req.params.verificationToken },
      //     { verify: true, token: token },
      //     { new: true }
      //   );
      const userVerification = {};
      return res
        .status(200)
        .json({ message: "Verification success", response: userVerification });
    } catch (error) {
      next(error);
    }
  }

  async doubleVerifyUser(req, res, next) {
    try {
      //   const { email } = req.body;
      //   const user = await UserModel.findOne({ email: email });
      //   if (!user) {
      //     return res.status(404).json({ message: `User not found`, response: null });
      //   }
      //   if (user.verify) {
      //     return res
      //       .status(404)
      //       .json({ message: `Verification has already been passed`, response: null });
      //   }
      //   const massageVerify = {
      //     to: email,
      //     subject: "Подтвердите ваш email для регистрации на нашем сервере",
      //     html: `<a target='_blank' href='${PORT}/api/auth/verify/${user.verificationToken}'>Нажмите для подтверждения регистрации на нашем сайте: ${PORT}</a>`,
      //   };
      //   await sendEmail(massageVerify);
      const massageVerify = {};
      return res.status(200).json({
        message: "Verification send to email",
        response: massageVerify,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new User();
