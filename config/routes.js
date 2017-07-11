// Server routes
// =============

// Bring in the Scrape function from our scripts directory
var scrape = require("../scripts/scrape");

// Bring headlines and notes from the controller
var headlinesController = require("../controllers/headlines");
var notesController = require("../controllers/notes");

module.exports = function(router) {
  // This route renders the homepage
  router.get("/", function(req, res) {
    res.render("home");
  });

  // This route renders the saved handledbars page
  router.get("/saved", function(req, res) {
    res.render("saved");
  });

  // This route handles scraping more articles to add to our db
  router.get("/api/fetch", function(req, res) {

    // This method inside the headlinesController will try and scrap new articles
    // and save unique ones to our database
    headlinesController.fetch(function(err, docs) {
      // If we don't get any articles back, likely because there are no new
      // unique articles, send this message back to the user
      if (!docs || docs.insertedCount === 0) {
        res.json({
          message: "No new articles today. Check back tomorrow!"
        });
      }
      // Otherwise send back a count of how many new articles we got
      else {
        res.json({
          message: "Added " + docs.insertedCount + " new articles!"
        });
      }
    });
  });

  // This route handles getting all headlines from our database
  router.get("/api/headlines", function(req, res) {
    // If the client specifies a saved query parameter, ie "/api/headlines/?saved=true"
    // which is translated to just { saved: true } on req.query,
    // then set the query object equal to this
    var query = {};
    if (req.query.saved) {
      query = req.query;
    }

    // Run the headlinesController get method and pass in whether we want saved, unsaved,
    // (or all headlines by default)
    headlinesController.get(query, function(data) {
      // Send the article data back as JSON
      res.json(data);
    });
  });

  // This route handles deleting a specified headline
  router.delete("/api/headlines/:id", function(req, res) {
    var query = {};
    // Set the _id property of the query object to the id in req.params
    query._id = req.params.id;

    // Run the headlinesController delete method and pass in our query object containing
    // the id of the headline we want to delete
    headlinesController.delete(query, function(err, data) {
      // Send the result back as JSON to be handled client side
      res.json(data);
    });
  });

  // This route handles updating a headline, in particular saving one
  router.patch("/api/headlines", function(req, res) {
    // Construct a query object to send to the headlinesController with the
    // id of the headline to be saved

    // We're using req.body here instead of req.params to make this route easier to
    // change if we ever want to update a headline in any way except saving it

    headlinesController.update(req.body, function(err, data) {
      // After completion, send the result back to the user
      res.json(data);
    });
  });

  // This route handles getting notes for a particular headline id
  router.get("/api/notes/:headline_id?", function(req, res) {
    // If we are supplied a headline id in req.params, then we will add the id to our query object
    // Otherwise query will remain an empty object and thus return every note
    var query = {};
    if (req.params.headline_id) {
      query._id = req.params.headline_id;
    }

    // Get all notes that match our query using the notesController get method
    notesController.get(query, function(err, data) {

      // Send the note data back to the user as JSON
      res.json(data);
    });
  });

  // This route handles deleting a note of a particular note id
  router.delete("/api/notes/:id", function(req, res) {
    var query = {};
    query._id = req.params.id;

    // Use the check function from the headlines controller,
    // this checks all of our articles, sorted by id number
    notesController.delete(query, function(err, data) {
      // Send the article data to a json
      res.json(data);
    });
  });

  // This route handles saving a new note
  router.post("/api/notes", function(req, res) {
    notesController.save(req.body, function(data) {
      // Send the note to the browser as a json
      res.json(data);
    });
  });
};



// // require express
// var express = require('express');
//
// // set up an Express router
// var router = express.Router();
//
// // bring in the Scrape function from our scripts dir
// var scrape = require('../scripts/scrape.js');
//
// // bring headlines and notes from the controller
// var headlinesController = require('../controllers/headlines.js');
// var notesController = require('../controllers/notes.js');
//
// // basic route use cb return json data from mongodb
// router.get('/', function(req, res) {
//     res.render('home');
// });
//
// //route for testing our scrape
// router.get('/test', function(req,res) {
//     // grab the article information from nytimes
//     scrape("https://www.jezebel.com", function(data) {
//         // send to browser as json
//         res.json(data);
//     });
// });
//
// // get grab web scrape
// router.post('/fetch', function(req, res) {
//     // use the fetch function from the headlines controller,
//     // this grabs all of the headlines from nyTimes and saves it to the db
//     headlinesController.fetch();
//     // send a success message to the browser
//     res.send('success');
// });
//
// // check the mongodb for data
// router.get('/check', function(req, res) {
//     // use the check function from the headlines controller,
//     // this checks all of our articles, sorted by id number
//     headlinesController.check(function(data) {
//         // send the article data to a json
//         res.json(data);
//     });
// });
//
// // gather the notes for an article from mongodb
// router.post('/gather', function(req, res) {
//     // gather all of the notes related to the article we pass
//     notesController.gather(req.body, function(data) {
//         // and send the notes as a json
//         res.json(data);
//     });
// });
//
// // post our saved note to the db
// router.post('/save', function(req, res) {
//     // using the article information passed through req.body
//     // and the save function from the notes controller
//     // saved the note
//     notesController.save(req.body, function(data) {
//         // send the note to the browser as a json
//         res.json(data);
//     });
// });
//
// // delete the notes of an article from mongodb
// router.delete('/delete', function(req, res) {
//     // using the notesController and the article passed in req.body
//     // delete all of an articles notes
//     notesController.delete(req.body, function(data) {
//         // send the removal data to the browser as a json
//         res.json(data);
//     });
// });
//
// // export this router so our server file can refer to it.
// module.exports = router;
