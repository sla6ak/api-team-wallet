const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createError } = require("../helpers");
const idGeneration = require("bson-objectid");
const { sendMail, sgMailData } = require("../helpers");

const dotenv = require("dotenv");
dotenv.config();
const { JWT_SECRET_KEY } = process.env;

class User {
  async addNewUser(req, res, next) {
    const { email, password, requireVerificationEmail } = req.body;
    const host = req.headers.host;

    try {
      const duplicateEmail = await UserModel.findOne({ email: email });
      if (duplicateEmail) {
        throw createError(409, "User not created. Email is duplicate");
      }

      const hashPassword = await bcrypt.hash(password, 12);

      const verificationToken = idGeneration();
      if (requireVerificationEmail) {
        await sendMail(sgMailData(verificationToken, email, host), next);
      }

      const user = await UserModel.create({
        ...req.body,
        password: hashPassword,
        verificationToken,
      });

      res.status(201).json({ user });
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

      if (user.requireVerificationEmail && !user.verify) {
        throw createError(401, `User ${email} not verify`);
      }

      const isPassword = await bcrypt.compare(password, user.password);

      if (!isPassword) {
        throw createError(401, `Email or password is wrong`);
      }

      const token = jwt.sign({ id: user._id }, JWT_SECRET_KEY, {
        expiresIn: "30d",
      });

      await UserModel.findByIdAndUpdate(user._id, { token });
      user.token = token;

      return res.json({ user });
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
      return res.json({ user });
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
      return res.status(200).json({ message: "Logout success" });
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

  async delete(req, res, next) {
    try {
      const { email } = req.user;
      const user = await UserModel.findOneAndDelete({ email });
      if (!user) {
        throw createError(404);
      }
      return res.json({ user });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new User();
