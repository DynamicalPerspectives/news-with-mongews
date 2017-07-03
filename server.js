// {{!-- // Note to self used  05 -15-2017, 05-17-2017 (handlebar stuff) and 06-19 and 06-21-2017 exercises for all of mongo stuff --}}

// dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var dotenv = require("dotenv");
var e
// database ORM
var mongoose = require("mongoose");
// scraping tools
var request = require("request");
var cheerio = require("cheerio");

// models needed
var Articles = require("./models/articles.js");
var Comments = require("./models/comments.js");

// imports routes
var routes = require("./controllers/article_controller.js");

// loads environment variables from .env file into process.env
dotenv.load();

// sets mongoose to leverage Promises
mongoose.Promise = Promise;

// sets port
var port = process.env.PORT || 3000;

// initializes express
var app = express();

// logs requests to the console
app.use(logger("dev"));

// parses data
app.use(bodyParser.urlencoded({
  extended: false
}));

// / makes public a static dir
app.use(express.static("public"));

// sets Handlebars
var exphbs = require("express-handlebars");

// sets default view engine to handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));

app.set("view engine", "handlebars");

// connects mongoose with the mongodb database (our db: newsscraper)
var mongoConfig = process.env.MONGODB_URI || "mongodb://localhost/newsscraper";
mongoose.connect(mongoConfig);

// saves our mongoose connection to db
var db = mongoose.connection;

// shows any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// logs a success message once logged in to the db through mongoose
db.once("open", function() {
  console.log("Mongoose connection successful.");
});


// COULDN''T GET THIS TO WORK ON HEROKU (and yes, I removed the other conncection above)
// mongoose.connect("mongodb://heroku_qbjjrjm9:p141ir5l1ffqhn9cpk2oaj0nrc@ds145312.mlab.com:45312/heroku_qbjjrjm9");
//
// var db = mongoose.connection;
//
// db.on('error', function (err) {
//   console.log('Mongoose Error: ', err);
// });
//
// db.once('open', function () {
//   console.log('Mongoose connection successful.');
// });


// Incorporate these routes into our app
// app.use('/', routes);
// app.use('/save', routes);
// app.use('/delete', routes);


 // routes
app.use("/", routes);

// listens on port
app.listen(port, function() {
	console.log("Listening on " + port);
});
