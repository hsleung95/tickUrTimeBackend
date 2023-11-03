const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "*"
};

var activityRecordRoutes = require("./app/routes/activityRecordRoutes");
var activityRoutes = require("./app/routes/activityRoutes");
var tokenRoutes = require("./app/routes/tokenRoutes");
var tokenController = require("./app/controllers/tokenController");

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "*"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );

  next();
});

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/token', tokenRoutes);
app.use('/activityRecords',tokenController.verifyToken, activityRecordRoutes);
app.use('/activities',tokenController.verifyToken, activityRoutes);

app.use('/', (req,res) => {
	res.sendStatus(200);
});

module.exports = app;