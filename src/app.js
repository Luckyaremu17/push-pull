const express = require("express");
const bodyParser = require("body-parser");

const app = express();

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("serverrunning");
});

app.post("api/email",(request,response) => {
  //code to perform particular action.
  //To access POST variable use req.body()methods.
  console.log(request.body);
  });

module.exports = app;
