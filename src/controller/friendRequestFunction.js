const User = require("../model/userModel");
const Inbox = require("../model/inboxModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");

class FriendController {

    async userSign(req, res) {
        try {
            const userDetail = {
                mail: req.body.mail,
                password: req.body.password
            };
            const existingUser = await User.findOne({ mail: userDetail.mail });
            if (!existingUser) {
                return res.status(200).json(`User Does Not Exists`);
            } else {
                const id = existingUser.id
                const hash = await bcrypt.compareSync(userDetail.password, existingUser.password);
                if (existingUser.mail === userDetail.mail && hash) {
                    const token = jwt.sign(id, process.env.signToken);
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

    async friendRequest(req, res) {
        try {
            const sendId = req.body.sendId;
            const { id } = req
            
            const userName = await User.findById(id)

            const userFind = await User.findById(sendId);
            if (!userFind) return res.send({ message: "User not exists" })
            
            const existingRequest = await Inbox.findOne({ My_id: id, sendId: sendId })
            if (existingRequest) return res.send({ message: "Request already sent to this user" })


            const alreadyFriends = await User.findById(id)
          
            if (alreadyFriends.friends.includes(sendId)) return res.send({ message: "You are already friends with the user" })
            else {

                const description = `Request Sent By ${userName.name} to ${userFind.name}`;
                await Inbox.create({ My_id: id, sendId: sendId, description: description });
                res.send({ message: "Friend Request Sent Successfully" })
            }

        } catch (err) {
            console.error(err)
            return res.send(err)
        }
    }

    async inbox(req, res) {
        try {
            const id = req.id
            const existingRequest = await Inbox.findOne({ sendId: id });
            if (!existingRequest) return res.send({ message: "No Request Found" });
            res.send({ message: "Friend Request", existingRequest })
        } catch (err) {
            console.error(err)
            return res.send({ message: "Server Error" });
        }
    }


    async requestProcess(req, res) {
        try {
            const { sendId, Accept } = req.body
            const id = req.id
            const existingRequest = await Inbox.findOne({ My_id: sendId, sendId: id });
            
            if (!existingRequest) return res.send({ message: "No Request Found" });
            if (Accept == 'true') {
                const name = await User.findById(sendId);
                const accept = await User.findById(id)
                accept.friends.push(sendId)
                const sender = await User.findById(sendId)
                sender.friends.push(id)

                await accept.save()
                await sender.save()

                await Inbox.findOneAndDelete({ My_id: sendId, sendId: id })
                res.send({ message: "Friend Request Accepted" })
            } else {
                await Inbox.findOneAndDelete({ My_id: sendId, sendId: id })
                res.send({ message: "Friend Request Not Accepted" })
            }
        } catch (err) {
            console.error(err)
            return res.send(err)
        }
    }


}

module.exports = new FriendController();
