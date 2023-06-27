const bcrypt = require("bcryptjs");
const User = require("../modal/userModal");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

//Upload Photes

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
	if (file.mimetype.startsWith("image")) {
		cb(null, true);
	} else {
		cb(new AppError("Not an image! Please upload only images.", 400), false);
	}
};

const upload = multer({
	storage: multerStorage,
	fileFilter: multerFilter,
});

// upload user photo
exports.uploadUserPhoto = upload.single("photo");

// resize user photo
exports.resizeUserPhoto = async (req, res, next) => {
	try {
		if (!req.file) return next();
		const filename = "user" + "-" + Date.now() + ".jpeg";
		req.file.filename = filename;

		await sharp(req.file.buffer)
			.resize(200, 200)
			.toFormat("jpeg")
			.jpeg({ quality: 90 })
			.toFile("public/" + req.file.filename);

		req.body.photo = filename;
	} catch (err) {
		console.log(err);
	}
	next();
};

// Signup User
exports.signup = async (req, res) => {
	try {
		console.log(req.body);
		// if user already exists
		const user = await User.findOne({ email: req.body.email });

		if (user) {
			return res.status(400).json({
				status: "fail",
				message: "User already exists",
			});
		}

		// encrypt passwords
		const ePassword = await bcrypt.hash(req.body.password, 12);

		// create new user
		const newUser = await User.create(req.body);

		// create token
		const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY);

		// send token
		res.cookie("jwt", token, {
			expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
			httpOnly: true,
		});

		res.status(200).json({
			status: "success",
			token,
			data: {
				newUser,
			},
		});
	} catch (err) {
		console.log(err);
		res.status(400).json({
			status: "fail",
			message: err,
		});
	}
};

// Login User
exports.login = async (req, res) => {
	// 1. check if email and password exists
	const { email, password } = req.body;

	if (!email || !password) {
		// Not operator => email = !null = true
		return res.status(400).json({
			status: "fail",
			message: "Please provide email and password",
		});
	}

	// 2. check if user exists && password is correct
	const user = await User.findOne({ email }).populate("toursCreated");

	const verifyPassword = await bcrypt.compare(password, user.password);

	if (!user && !verifyPassword) {
		return res.status(400).json({
			status: "fail",
			message: "Incorrect email or password",
		});
	}

	// 3. if everything is ok, send token to client
	const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);

	// send token
	res.cookie("jwt", token, {
		expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
		httpOnly: true,
	});

	if (user.photo) {
		const image = fs.readFileSync(
			path.join(__dirname, `../public/${user.photo}`)
		);

		const base64EncodedImage = image.toString("base64");

		user.photo = base64EncodedImage;
	}

	res.status(200).json({
		status: "success",
		token,
		user,
	});
};

// forget password function

// reset password function

// creating a user
exports.createUser = async (req, res) => {
	try {
		console.log(req.body);
		const newUser = await User.create(req.body);

		res.status(200).json({
			status: "success",
			data: {
				newUser,
			},
		});
	} catch (err) {
		res.status(404).json({
			status: "fail",
			message: err,
		});
	}
};

// creating a user
exports.getAllUsers = async (req, res) => {
	try {
		const users = await User.find();

		// get photoes
		users.forEach((user) => {
			if (user.photo) {
				const image = fs.readFileSync(
					path.join(__dirname, `../public/${user.photo}`)
				);

				const base64EncodedImage = image.toString("base64");

				user.photo = base64EncodedImage;
			}
		});

		res.status(200).json({
			status: "success",
			data: {
				users,
			},
		});
	} catch (err) {
		res.status(404).json({
			status: "fail",
			message: err,
		});
	}
};

// creating a user
exports.getOneUser = async (req, res) => {
	try {
		const id = req.params.id;
		const user = User.findById(id);

		res.status(200).json({
			status: "success",
			data: {
				user,
			},
		});
	} catch (err) {
		res.status(404).json({
			status: "fail",
			message: err,
		});
	}
};

// creating a user
exports.deleteUser = async (req, res) => {
	try {
		const id = req.params.id;
		const user = User.findByIdAndDelete(id);

		res.status(200).json({
			status: "success",
			message: "User deleted successfully",
		});
	} catch (err) {
		res.status(404).json({
			status: "fail",
			message: err,
		});
	}
};
