const Tour = require("../modal/tourModal");
const User = require("../modal/userModal");
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
exports.uploadTourPhoto = upload.single("photo");

// resize user photo
exports.resizeTourPhoto = async (req, res, next) => {
	try {
		if (!req.file) return next();
		const filename = "tour" + "-" + Date.now() + ".jpeg";
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

// get all tours
exports.getAllTours = async (req, res) => {
	// do this thing
	try {
		// for getting all tours

		const tours = await Tour.find(); // this is method for all data of database

		// photoes
		tours.forEach((tour) => {
			const image = fs.readFileSync(
				path.join(__dirname, `../public/${tour.photo}`)
			);

			//encode
			tour.photo = image.toString("base64");
		});

		res.status(200).json({
			status: "success",
			data: {
				tours: tours,
			},
		});
		// send error
	} catch (err) {
		res.status(404).json({
			status: "fail",
			message: err,
		});
	}
};

// get one tour
exports.getTour = async (req, res) => {
	const id = req.params.id; // taking id

	try {
		const tour = await Tour.findById(id);

		const image = fs.readFileSync(
			path.join(__dirname, `../public/${tour.photo}`)
		);

		//encode
		tour.photo = image.toString("base64");
		// for getting one tours
		res.status(200).json({
			status: "success",
			data: {
				tours: tour,
			},
		});
	} catch (err) {
		res.status(404).json({
			status: "fail",
			message: err,
		});
	}
};
// create ~~
exports.createTour = async (req, res) => {
	try {
		// create tour
		const newTour = await Tour(req.body); // this is method for create data of database

		console.log(req.body);
		// save tour
		await newTour.save();

		res.status(200).json({
			status: "success",
			data: {
				tours: newTour,
			},
		});
	} catch (err) {
		console.log(err);
		res.status(404).json({
			status: "fail",
			message: err,
		});
	}
};

// delete Tour
exports.deleteTour = async (req, res) => {
	const id = req.params.id; // taking id

	try {
		await Tour.findByIdAndDelete(id); // this is method for delete data of database

		// for getting one tours
		res.status(200).json({
			status: "success",
			data: {
				tours: "Tour is deleted successfully",
			},
		});
	} catch (err) {
		res.status(404).json({
			status: "fail",
			message: err,
		});
	}
};
exports.updateTour = async (req, res) => {
	const id = req.params.id; // tour id
	console.log(req.body);

	try {
		const tour = await Tour.findByIdAndUpdate(id, req.body, {
			runValidators: false,
			new: true,
		});

		res.status(200).json({
			status: "success",
			data: {
				tours: tour,
			},
		});
	} catch (err) {
		console.log(err);
		res.status(404).json({
			status: "fail",
			message: err,
		});
	}
};
