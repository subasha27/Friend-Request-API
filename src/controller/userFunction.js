const User = require("../model/userModel");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../helpers/sendEmail");

class UserController {
  async   signUp(req, res) {
    try {
      const { name, mail, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const existingUser = await User.findOne({mail: mail });
      if (existingUser) return res.status(409).send({ message: "User Already Exists" });

      const user = await User.create({ name, mail, password: hashedPassword });
      const id = user.id;
      res.status(200).json({ message: "User Registered Successfully", user, id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred during signup.' });
    }
  }

  async updateUser(req, res) {
    try {
      const id = req.params.id;
      const upDetails = req.body;

      if (upDetails.password) {
        const upHashPass = await bcrypt.hash(upDetails.password, 10);
        upDetails.password = upHashPass;
      }

      const checkUser = await User.findByIdAndUpdate(id,{$set:req.body},{new:true})
      if (!checkUser) {
        return res.status(404).json({ message: "Data Not Found" });
      }
      
      await checkUser.save();
      res.status(200).json({ message: "Updated", data: checkUser });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: "Server Error..." });
    }
  }

  async deleteUser(req, res) {
    try {
      const id = req.params.id;
      const checkUser = await User.findByIdAndDelete(id);
      if (!checkUser) {
        return res.status(404).json({ message: "Data Not Found" });
      }
      res.status(200).json({ message: "Deleted" });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: "Server Error..." });
    }
  }

  async getUser(req, res) {
    try {
      const id = req.params.id;
      const checkUser = await User.findById(id);
      if (!checkUser) {
        return res.status(404).json({ message: "Data Not Found" });
      }
      res.status(200).json({ userData: checkUser });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: "Server Error..." });
    }
  }

  async getAllUser(req, res) {
    try {
      const allUsers = await User.find();
      if (!allUsers) {
        return res.status(404).json({ message: "Data Not Found" });
      }
      res.status(200).json({ allData: allUsers });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: "Server Error..." });
    }
  }

  async userSign(req, res) {
    try {
      const userDetail = {
        mail: req.body.mail,
        password: req.body.password
      };
      const existingUser = await User.findOne({mail: userDetail.mail });
      if (!existingUser) {
        return res.status(200).json(`User Does Not Exists`);
      } else {
        const hash = await bcrypt.compareSync(userDetail.password, existingUser.password);
        if (existingUser.mail === userDetail.mail && hash) {
          const token = jwt.sign(userDetail.mail, process.env.secretToken);
          return res.status(200).json({ message: "User login Successfull", token });
        } else {
          return res.status(200).json({ message: "User login Failed" });
        }
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server Error" });
    }
  }

  async passRequest(req, res) {
    try {
      const existingUser = await User.findOne({ mail: req.body.mail });
      if (!existingUser) {
        return res.status(200).json(`User Does Not Exists`);
      } else {
        const resetToken = jwt.sign(req.body.mail, process.env.secretToken);
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
      const decodedToken = req.user;
    
      const existingUser = await User.findOne({  mail: decodedToken });
   
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

  async passChange(req, res) {
    try {
      const decodedToken = req.user;
      c
      const existingUser = await User.findOne({  mail: decodedToken });
     
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
