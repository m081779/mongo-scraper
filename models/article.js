const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const articleSchema = new Schema({
  headline: {
    type: String,
    unique: 'Must have a unique headline, doofus'
  },
  summary: String,
  storyUrl: String,
  imgUrl: String,
  byLine: String,
  saved: {
    type: Boolean,
    default: false
  },
  notes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Note"
    }
  ]
});

const Article = module.exports = mongoose.model('Article', articleSchema);
