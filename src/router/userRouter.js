
const express = require("express");
const router = express.Router();
const userController = require("../controller/userFunction");
const FriendController = require("../controller/friendRequestFunction")
const userToken = require("../middleware/UserAuthmiddleware");

//account creation
router.post('/signup', userController.signUp);

//login
router.post('/UserLog',FriendController.userSign);

//password change
router.post('/UserPassReset',userController.passRequest);
router.post(`/PassChange`,userToken,userController.passChange);

//friend Request
router.get('/getAllUser',FriendController.getAllUser);
router.post('/FriendRequest',userToken,FriendController.friendRequest);
router.get('/Inbox',userToken,FriendController.inbox)
router.post('/RequestProcess',userToken,FriendController.requestProcess)
router.get('/GetFriends',userToken,FriendController.getFriends);


module.exports=router;