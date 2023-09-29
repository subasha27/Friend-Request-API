const User = require("../model/userModel");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config()
const sendEmail = require("../helpers/sendEmail");

class UserController {
  async signUp(req, res) {
    try {
      const { name, mail, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const existingUser = await User.findOne({ mail: mail });
      if (existingUser) return res.status(409).send({ message: "User Already Exists" });

      const user = await User.create({ name, mail, password: hashedPassword });
      const id = user.id;
      res.status(200).json({ message: "User Registered Successfully", user, id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred during signup.' });
    }
  }


  async passRequest(req, res) {
    try {
      const existingUser = await User.findOne({ mail: req.body.mail });
      if (!existingUser) {
        return res.status(200).json(`User Does Not Exists`);
      } else {
        const userId = await User.findOne({ mail: req.body.mail })
        const user_id = userId._id.toString();

        const resetToken = jwt.sign(user_id, process.env.signToken);
        const link = `http://localhost:${process.env.PORT}/api/PassChange?token=${resetToken}`;
        sendEmail(existingUser.mail, 'Password Reset Request', link);
        return res.status(200).json({ message: "Password reset link sent successfully" });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async passChange(req, res) {
    try {
      const decodedToken = req.id;

      const userMail = await User.findById(decodedToken)
      const mail = userMail.mail
      const existingUser = await User.findOne({ mail: mail });

      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      existingUser.password = hashedPassword;
      await existingUser.save();
      return res.status(200).json({ message: "Password changed successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

module.exports = new UserController();
