const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	age: {
		type: Number,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	passwordConfirm: {
		type: String,
		required: true,
	},
	aboutMe: {
		type: String,
		required: true,
	},
	photo: {
		type: String,
		required: true,
	},

	toursCreated: [
		{
			type: mongoose.Schema.ObjectId,
			ref: "Tour",
		},
	],
});

userSchema.virtual("bookings", {
	ref: "Booking",
	foreignField: "user",
	localField: "_id",
});

const User = mongoose.model("User", userSchema);

module.exports = User;
