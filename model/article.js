const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
  headline: String,
  summary: String,
  url: String,
  imgUrl: String,
  byLine: String,
  saved: {
    type: Boolean,
    default: false
  },
  notes: [{
    type: String
  }]
});

const Article = module.exports = mongoose.model('Article', articleSchema);
