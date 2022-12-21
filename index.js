const express = require("express");
const bodyParser = require("body-parser");

// load environment
require('dotenv').config();

console.log(process.env.BASE_URI);

// Import the mongoose module
const mongoose = require("mongoose");
mongoose.set('strictQuery',false);

// Set up default mongoose connection
const mongoDB = "mongodb://0.0.0.0:27017/games";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

//create webserver
const app = express();

// middleware to parse x-form urlencoded
app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json())
// middleware to parse json data
// app.use(bodyParser.json({type : 'application/json'}));

const gamesRouter = require("./routers/gamesRouter");

//create route
app.use("/games/", gamesRouter);

// start webservice on port 8000
app.listen(8000, () => {
    console.log("Server running");
});