const mongoose = require("mongoose");

// Article Schema
const articleschema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
  },
  body: {
    type: String,
    required: true,
  },
  au: {
    type: String,
    required: true,
  },
  date: {
    type: String,
  },
});
const Article = mongoose.model("Article", articleschema);
module.exports.Article = Article;
