const express = require('express');
const cheerio = require('cheerio');
const request = require('request');
const router = express.Router();
const db = require("../models");


router.get('/', (req,res) => {
  db.Article
    .find({})
    .then(articles => res.render('index', {articles}))
    .catch(err=> res.json(err));
});

router.get("/scrape", function(req, res) {
  let counter = 0;
  request("https://www.nytimes.com/section/us", function(error, response, html) {
    // let articleArr = [];
    const $ = cheerio.load(html);

    $("li article.story.theme-summary").each((i, element) => {
      let article = new db.Article({
        storyUrl: $(element).find('.story-body>.story-link').attr('href'),
        headline: $(element).find('h2.headline').text().trim(),
        summary: $(element).find('p.summary').text().trim(),
        imgUrl: $(element).find('img').attr('src'),
        byLine: $(element).find('p.byline').text().trim()
      });

      db.Article
        .create(article)
        .then(result => counter++)
        .catch(err => console.log('++++++++++++++++++++++++++++++++++++',err));
    });//end of each function
  });//end of request to NY times
});// end of get request to /scrape

router.get('/save/:id', (req,res) => {
  db.Article
    .update({_id: req.params.id},{saved: true})
    .then(result=> res.redirect('/'))
    .catch(err => res.json(err));
});

router.get('/viewSaved', (req, res) => {
  db.Article
    .find({})
    .then(result => res.render('savedArticles', {articles:result}))
    .catch(err => res.json(err));
});

router.get('/getNotes/:id', function (req,res){
  console.log('req.params.id from /getNotes:', req.params.id)
  db.Article
    .findOne({_id: req.params.id})
    .populate('notes')
    .then(results => res.json(results))
    .catch(err => res.json(err));
});

router.post('/createNote', function (req,res){
  let { title, body, articleId } = req.body;
  console.log('articleId from /createNote:', articleId)
  let note = {
    title,
    body
  }
  // console.log('note from createNote:', note);
  db.Note
    .create(note)
    .then( result => {
      // console.log('result from creating a note:', result)
      db.Article
        .findOneAndUpdate({_id: articleId}, {$push:{notes: result._id}},{new:true})
        .then( data => res.json(result))
        .catch( err => res.json(err));
    })
    .catch(err => res.json(err));
});

router.get('/deleteArticle/:id', function(req,res){
  db.Article
    .remove({_id: req.params.id})
    .then(result => res.json(result))
    .catch(err => res.json(err));
});

router.post('/deleteNote', (req,res)=>{
  let {articleId, noteId} = req.body
  console.log('req.body from /deleteNote:',req.body)
  db.Note
    .remove({_id: noteId})
    .then(result => res.json(result))
    .catch(err => res.json(err));
});

router.get('/getSingleNote/:id', function (req,res) {
  // console.log('req.params.id from /getSingleNote:', req.params.id)
  db.Note
    .findOne({_id: req.params.id})
    .then( result => {
      // console.log('result from /getSingleNote:',result)
      res.json(result)
    })
    .catch(err => res.json(err));
});

module.exports = router;
