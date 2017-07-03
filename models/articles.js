// Note to self used  06-19 and 06-21-2017 exercises
// dependency
var mongoose = require('mongoose');

//creates Schema class
var Schema = mongoose.Schema;

// create Articles schema
var ArticlesSchema = new Schema ({
  title: {
    type: String,
    required: true,
    index: { unique: true }
  },
  link: {
    type: String,
  },
  saved: {
    type: Boolean,
    default: false
  },
  comments: {
    // save the comment ObjectID
    type: Schema.Types.ObjectId,
    ref: "Comments"
  }
});

// creates Articles model
var Articles = mongoose.model("Articles", ArticlesSchema);

// exports Articles model
module.exports = Articles;
