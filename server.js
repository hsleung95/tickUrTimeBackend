const AWS = require("aws-sdk");
const app = require("./app");

AWS.config.update({region: "us-west-1"});

// set port, listen for requests
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  // console.log(`Server is running on port ${PORT}.`);
});
