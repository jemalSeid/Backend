const mongoose = require("mongoose");

// Tour Modal
const tourSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true, // our tour will be unique
		},
		price: {
			type: Number,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		duration: {
			type: Number,
			required: true,
		},
		noOfParticipants: {
			type: Number,
		},
		category: {
			type: String,
			required: true,
			enum: ["Nature", "Adventure", "Ocean", "Forest"],
		},
		photo: {
			type: String,
			required: true,
		},

		user: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
		},
	},
	{
		toJSON: { virtuals: true }, // Include virtual properties in JSON
	}
);

// virtual property
tourSchema.virtual("durationInWeeks").get(function () {
	return Math.floor(this.duration / 7);
});

tourSchema.virtual("bookings", {
	ref: "Booking",
	foreignField: "tour",
	localField: "_id",
});

//Modal
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
