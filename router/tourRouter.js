const express = require("express");
const tourController = require("../controller/tourController");

// i have to get router
const tourRouter = express.Router();

// /tours (get)
// getting data
tourRouter.route("/").get(tourController.getAllTours);

// /tours (post)
// posting data
tourRouter
	.route("/")
	.post(
		tourController.uploadTourPhoto,
		tourController.resizeTourPhoto,
		tourController.createTour
	);

//tours/12718724
// getting one tour
tourRouter.route("/:id").get(tourController.getTour);
// deleting data

//tours/12718724 (delete)
tourRouter.route("/:id").delete(tourController.deleteTour);

//tours (patch)
// updating data
tourRouter.route("/:id").patch(tourController.updateTour);

module.exports = tourRouter;
