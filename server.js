// DEPENDENCIES //

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var request = require('request');
var cheerio = require('cheerio');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));

// PUBLIC STATIC DIRECTORY //

app.use(express.static('public'));


// CONFIQ MONGOOSE DB //

mongoose.connect('mongodb://localhost/week18hw');
var db = mongoose.connection;

db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});

db.once('open', function() {
  console.log('Mongoose connection successful.');
});

// NOTES & ARTICLES //

var Note = require('./models/Note.js');
var Article = require('./models/Article.js');

// ROUTES //

app.get('/', function(req, res) {
  res.send(index.html);
});

// SCRAPE WEBSIGHT //

app.get('/scrape', function(req, res) {

  request('http://www.app.com/', function(error, response, html) {
    var $ = cheerio.load(html);
    $('li data-content-id').each(function(i, element) {

    			// RESULTS EMPTY //

				var result = {};

				// PROPERTIES //

				result.title = $(this).children('a').text();
				result.link = $(this).children('a').attr('href');

				// ARTICLES for RESULTS //

				var entry = new Article (result);

				// SAVE to DB //

				entry.save(function(err, doc) {

				  if (err) {
				    console.log(err);
				  }
				  else {
				    console.log(doc);
				  }
			});
    	});
  });

 // SCRAPE COMPLETE //

  res.send("Scrape Complete");
});

// SCRAPED ARTICLES from MONGODB //

app.get('/articles', function(req, res){

	// ARTICLES ARRAY //

	Article.find({}, function(err, doc){

		if (err){
			console.log(err);
		}
		else {
			res.json(doc);
		}
	});
});

// OBJECT ID //

app.get('/articles/:id', function(req, res){

	// QUERY MATCH from DB //

	Article.findOne({'_id': req.params.id})

	// TO NOTE //

	.populate('note')

	// EXECUTE QUERY //

	.exec(function(err, doc){

		if (err){
			console.log(err);
		}
		else {
			res.json(doc);
		}
	});
});


// REPLACE NOTE //

app.post('/articles/:id', function(req, res){

	// NEW NOTE //

	var newNote = new Note(req.body);

	// NEW NOTE to DB //

	newNote.save(function(err, doc){

		if(err){
			console.log(err);
		}
		else {

	// MATCH in DB //

			Article.findOneAndUpdate({'_id': req.params.id}, {'note':doc._id})

	// EXECUTE QUERY //

			.exec(function(err, doc){

				if (err){
					console.log(err);
				} else {

					res.send(doc);
				}
			});
		}
	});
});

// PORT 3000 //

app.listen(3000, function() {
  console.log('App running on port 3000!');
});
