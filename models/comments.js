
// dependency
var mongoose = require('mongoose');

// creates Schema class
var Schema = mongoose.Schema;

// creates Comments schema
var CommentsSchema = new Schema({
  title: {
    type: String
  },
  body: {
    type: String
  }
});

// creates Comments model
var Comments = mongoose.model("Comments", CommentsSchema);

// exports Comments model
module.exports = Comments;


