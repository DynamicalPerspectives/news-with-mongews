/* Scraping into DB (18.2.5)
 * ========================== */

// Dependencies
// var express = require("express");
// var handlesbars = require ("express-handlebars");
// var mongojs = require("mongojs");
// // Require request and cheerio. This makes the scraping possible
// var request = require("request");
// var cheerio = require("cheerio");
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var mongojs =  require ("mongojs")
var request = require('request');
var cheerio = require('cheerio');

var Note = require("./models/note.js");
var Article = require("./models/article.js");


app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Initialize Express

// PUBLIC STATIC DIRECTORY //
// var app = express();
// app.use(express.static('public'));



// Database configuration
var databaseUrl = "jeznews";
var collections = ["newsData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});


// Main route (simple Hello World Message)
app.get("/", function(req, res) {
  res.send("Hello world");
});

// Retrieve data from the db
app.get("/all", function(req, res) {
  // Find all results from the newsData collection in the db
  db.newsData.find({}, function(error, found) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as a json
    else {
      res.json(found);
    }
  });
});

// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {
  // Make a request for the news section of ycombinator
  request( "https://www.jezebel.com/", function(error, response, html) {
    // Load the html body from request into cheerio
    var $ = cheerio.load(html);

    // / Select each instance of the HTML body that you want to scrape
    // NOTE: Cheerio selectors function similarly to jQuery's selectors,
    // but be sure to visit the package's npm page to see how it works

    $('h1.headline.entry-title.js_entry-title').each(function(i, element){

      var link = $(element).children().attr("href");
      var title = $(element).children().text();
      // If this title element had both a title and a link
      if (title && link) {
        // Save the data in the newsData db
        db.newsData.save({
          title: title,
          link: link
        },
        function(error, saved) {
          // If there's an error during this query
          if (error) {
            // Log the error
            console.log(error);
          }
          // Otherwise,
          else {
            // Log the saved data
            console.log(saved);
          }
        });
      }
    });
  });

  // This will send a "Scrape Complete" message to the browser
  res.send("Scrape Complete");
});


// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});





// DEPENDENCIES //

// var express = require('express');
// var app = express();
// var bodyParser = require('body-parser');
// var logger = require('morgan');
// var mongoose = require('mongoose');
// var request = require('request');
// var cheerio = require('cheerio');
//
// app.use(logger('dev'));
// app.use(bodyParser.urlencoded({
//   extended: false
// }));

// PUBLIC STATIC DIRECTORY //

// app.use(express.static('public'));


// CONFIQ MONGOOSE DB //

// mongoose.connect('mongodb://localhost/week18hw');
// var db = mongoose.connection;
//
// db.on('error', function(err) {
//   console.log('Mongoose Error: ', err);
// });
//
// db.once('open', function() {
//   console.log('Mongoose connection successful.');
// });

// NOTES & ARTICLES //

// var Note = require('./models/Note.js');
// var Article = require('./models/Article.js');

// ROUTES //

// app.get('/', function(req, res) {
//   res.send(index.html);
// });

// SCRAPE WEBSIGHT //

// app.get('/scrape', function(req, res) {
//
//   request('http://www.app.com/', function(error, response, html) {
//     var $ = cheerio.load(html);
//     $('li data-content-id').each(function(i, element) {

    			// RESULTS EMPTY //

				// var result = {};

				// PROPERTIES //
        //
				// result.title = $(this).children('a').text();
				// result.link = $(this).children('a').attr('href');

				// ARTICLES for RESULTS //
        //
				// var entry = new Article (result);

				// SAVE to DB //

	// 			entry.save(function(err, doc) {
  //
	// 			  if (err) {
	// 			    console.log(err);
	// 			  }
	// 			  else {
	// 			    console.log(doc);
	// 			  }
	// 		});
  //   	});
  // });

 // SCRAPE COMPLETE //

//   res.send("Scrape Complete");
// });

// SCRAPED ARTICLES from MONGODB //

// app.get('/articles', function(req, res){

	// ARTICLES ARRAY //

// 	Article.find({}, function(err, doc){
//
// 		if (err){
// 			console.log(err);
// 		}
// 		else {
// 			res.json(doc);
// 		}
// 	});
// });

// OBJECT ID //
//
// app.get('/articles/:id', function(req, res){

	// QUERY MATCH from DB //

	// Article.findOne({'_id': req.params.id})

	// TO NOTE //

	// .populate('note')

	// EXECUTE QUERY //

// 	.exec(function(err, doc){
//
// 		if (err){
// 			console.log(err);
// 		}
// 		else {
// 			res.json(doc);
// 		}
// 	});
// });


// REPLACE NOTE //

// app.post('/articles/:id', function(req, res){

	// NEW NOTE //

	// var newNote = new Note(req.body);

	// NEW NOTE to DB //

	// newNote.save(function(err, doc){
  //
	// 	if(err){
	// 		console.log(err);
	// 	}
	// 	else {

	// MATCH in DB //

			// Article.findOneAndUpdate({'_id': req.params.id}, {'note':doc._id})

	// EXECUTE QUERY //

// 			.exec(function(err, doc){
//
// 				if (err){
// 					console.log(err);
// 				} else {
//
// 					res.send(doc);
// 				}
// 			});
// 		}
// 	});
// });

// PORT 3000 //
//
// app.listen(3000, function() {
//   console.log('App running on port 3000!');
// });
