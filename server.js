const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "https://localhost:3000"
};

var activityRecordRoutes = require("./app/routes/activityRecordRoutes");
var activityRoutes = require("./app/routes/activityRoutes");
var tokenRoutes = require("./app/routes/tokenRoutes");
var tokenController = require("./app/controllers/tokenController");

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/token', tokenRoutes);
app.use('/activityRecords',tokenController.verifyToken, activityRecordRoutes);
app.use('/activities',tokenController.verifyToken, activityRoutes);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

app.get("/", (req,res) => {
	res.json({message: "hello world"});
});

const db = require("./app/models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });
