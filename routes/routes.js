const express = require('express');
const cheerio = require('cheerio');
const request = require('request');
const router = express.Router();
const Article = require('../model/article');

router.get('/', (req,res)=>{
  Article.find({}, function (err,result) {
    if (err){
      console.log(err);
    } else {
      res.render('index', {articles:result});
    }
  });
});


router.get("/scrape", function(req, res) {
  let counter = 0;
  request("https://www.nytimes.com/section/us", function(error, response, html) {

    let $ = cheerio.load(html);
    // For each element with a "title" class
    $("article.story.theme-summary").each(function(i, element) {
        let article = new Article({
          headline: $(element).find('h2.headline').text().trim(),
          summary: $(element).find('p.summary').text().trim(),
          url: $(element).find('.story-link').attr('href'),
          imgUrl: $(element).find('img').attr('src'),
          byLine: $(element).find('p.byline').text().trim(),
        });

      if (article) {
        article.save(function(err) {
          if (err) {
            console.log(err);
          }
          else {
            Article.findOne({headline: article.headline}, function (err,result){
              if (err){
                console.log(err);
              } else if (!result) {
                console.log('article successfully added')
                counter++;
              }
            });
          }
        });
      }
      // console.log(`${counter} articles successfully added`)
    });
    res.redirect('/');
  });
});

router.get('/save/:id', function (req,res){
  Article.update({_id: req.params.id},{saved: true}, function (err,result){
    console.log('result from update method:',result);
    res.redirect('/');
  });
});

router.get('/viewSaved', function (req, res){
  Article.find({}, function (err,result) {
    if (err){
      console.log(err);
    } else {
      res.render('savedArticles', {articles:result});
    }
  });
});

router.get('/getNotes/:id', function (req,res){
  Article.findOne({_id: req.params.id}, function (err,result){
    if (err){
      console.log(err)
    } else {
      res.json(result.notes);
    }
  });
});

router.post('/createNote', function (req,res){
  Article.findOneAndUpdate(
    {_id: req.body.id},
    {$push: {notes: req.body.text}},
    function (err, model) {
      if (err){
        console.log(err);
      } else {
        console.log('Note successfully added');
        res.json(req.body.text)
      }
    }
  );
});

router.get('/deleteArticle/:id', function(req,res){
  console.log(req.params.id);
  Article.remove({
    _id: req.params.id,
  }, function (err, result){
    if(err) throw err;
    console.log(result)
    res.json(result);
  });
})

module.exports = router;
