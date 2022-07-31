const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createError, defaultResponseData } = require("../helpers");
const idGeneration = require("bson-objectid");
const { sendMail, sgMailData } = require("../helpers");

const dotenv = require("dotenv");
dotenv.config();
const { JWT_SECRET_KEY } = process.env;

class User {
  async addNewUser(req, res, next) {
    const { email, password, requireVerificationEmail } = req.body;

    console.log(`${email}, ${password}, ${requireVerificationEmail}`);

    try {
      const duplicateEmail = await UserModel.findOne({ email: email });
      if (duplicateEmail) {
        throw createError(409, "User not created. Email is duplicate");
      }

      const hashPassword = await bcrypt.hash(password, 12);

      const verificationToken = idGeneration();
      if (requireVerificationEmail) {
        const send = await sendMail(sgMailData(verificationToken, email), next);
        console.log(send);
      }

      const user = await UserModel.create({
        ...req.body,
        password: hashPassword,
        verificationToken,
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
      const result = await UserModel.findOne({ email });

      if (!result) {
        throw createError(401, `Email or password is wrong`);
      }

      if (result.requireVerificationEmail && !result.verify) {
        throw createError(401, `User ${email} not verify`);
      }

      const isPassword = await bcrypt.compare(password, result.password);

      if (!isPassword) {
        throw createError(401, `Email or password is wrong`);
      }

      const token = jwt.sign({ id: result._id }, JWT_SECRET_KEY, {
        expiresIn: "30d",
      });

      await UserModel.findByIdAndUpdate(result._id, { token });
      const user = await UserModel.findOne(result._id);
      user.token = token;

      const data = { ...defaultResponseData(), user };
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
      console.log(user);
      return res.status(204).json();
    } catch (error) {
      next(error);
    }
  }

  async verifyEmail(req, res, next) {
    try {
      const verificationToken = req.params;
      const user = await UserModel.findOne(verificationToken);
      if (!user) {
        throw createError(404, "User not found");
      }

      const result = await UserModel.findByIdAndUpdate(user._id, {
        verificationToken: null,
        verify: true,
      });

      if (!result) {
        throw createError(499, "verificationToken error");
      }

      res.json({ message: "Verification successful" });
    } catch (error) {
      next(error);
    }
  }

  async resendVerifyEmail(req, res, next) {
    try {
      const { email } = req.body;
      const user = await UserModel.findOne(email);
      if (!user) {
        throw createError(409, "Email not found");
      }

      if (user.verify) {
        throw createError(400, "Verification has already been passed");
      }

      await sendMail(sgMailData(user.verificationToken, email), next);

      res.json({ message: "Verification email sent" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new User();
