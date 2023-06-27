const express = require("express");
const userController = require("../controller/userController");

// i have to get router
const userRouter = express.Router();

userRouter
	.route("/signup")
	.post(
		userController.uploadUserPhoto,
		userController.resizeUserPhoto,
		userController.signup
	);
userRouter.route("/login").post(userController.login);

// getting data
userRouter.route("/").get(userController.getAllUsers);

// posting data
userRouter.route("/").post(userController.createUser);

// getting one user

userRouter.route("/:id").get(userController.getOneUser);
// deleting data

userRouter.route("/:id").delete(userController.deleteUser);

module.exports = userRouter;
