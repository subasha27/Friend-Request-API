
const express = require("express");
const router = express.Router();
const userController = require("../controller/userFunction");
const FriendController = require("../controller/friendRequestFunction")
const verifyToken = require("../middleware/PasswordResetMiddleware");
const userToken = require("../middleware/UserAuthmiddleware");


//crud
router.post('/signup', userController.signUp);
router.put('/createIt/:id',userController.updateUser);
router.delete('/createIt/:id',userController.deleteUser);
router.get('/getIt/:id',userController.getUser);
router.get('/getAll',userController.getAllUser);

//login
router.post('/UserLogin',userController.userSign);
router.post('/UserPassReset',userController.passRequest);
router.post(`/PassChange`,verifyToken,userController.passChange);

//friend Request
router.post('/UserLog',FriendController.userSign);
router.get('/getAllUser',FriendController.getAllUser);
router.post('/FriendRequest',userToken,FriendController.friendRequest);
router.get('/Inbox',userToken,FriendController.inbox)
router.post('/RequestProcess',userToken,FriendController.requestProcess)
router.get('/GetFriends',userToken,FriendController.getFriends);


module.exports=router;