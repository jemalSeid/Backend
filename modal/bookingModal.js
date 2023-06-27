const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
	tour: {
		type: mongoose.Schema.ObjectId,
		ref: "Tour",
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
	},

	price: {
		type: Number,
		required: true,
	},

	date: {
		type: Date,
		required: true,
	},
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
