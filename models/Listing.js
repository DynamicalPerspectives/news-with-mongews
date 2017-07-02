// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var ListingSchema = new Schema({
  // title is a required string
  title: {
    type: String,
    required: true
  },
  // price is a required string
  // price: {
  //   type: String,
  //   required: true
  // },
  // price is a required string
  // date: {
  //   type: String,
  // //   required: true
  // },
  // link is a required string
  link: {
    type: String,
    required: true
  },
  // This only saves one note's ObjectId, ref refers to the Note model
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// Create the Article model with the ArticleSchema
var Listing = mongoose.model("Listing", ListingSchema);

// Export the model
module.exports = Listing;
