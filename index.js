const http = require("http");
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose"); // mongoose
const cors = require("cors");
// ROuters
const tourRouter = require("./router/tourRouter");
const userRouter = require("./router/userRouter");

// Configure .env file
dotenv.config({ path: "./.env" });

const app = express();
app.use(express.json()); // that will help us to get data from application
app.use(cors());

// Connect my Database
const dbURI = process.env.DATABASE.replace(
	"<PASSWORD>",
	process.env.DATABASE_PASSWORD
);

mongoose
	.connect(dbURI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("Database is connected");
	})
	.catch((err) => {
		console.log("Error in connecting database", err);
	});

// We have to route requests
app.use("/tours", tourRouter);
app.use("/users", userRouter);
// reviews
//

// server
app.listen(process.env.PORT, () => {
	console.log("Server is started at Port No: ", process.env.PORT);
});
