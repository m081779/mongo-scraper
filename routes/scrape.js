const express = require('express');
const cheerio = require('cheerio');
// const request = require('request');
var rp = require('request-promise');
const router = express.Router();
const db = require("../models");

router.get("/newArticles", function(req, res) {
  let newArticleArr = [];

  const options = {
    uri: "https://www.nytimes.com/section/us",
    transform: function (body) {
        return cheerio.load(body);
    }
  };
  db.Article
    .find({})
    .then((savedArticles) => {
        rp(options)
          .then(function ($) {
            $("li article.story.theme-summary").each((i, element) => {
              let newArticle = new db.Article({
                storyUrl: $(element).find('.story-body>.story-link').attr('href'),
                headline: $(element).find('h2.headline').text().trim(),
                summary : $(element).find('p.summary').text().trim(),
                imgUrl  : $(element).find('img').attr('src'),
                byLine  : $(element).find('p.byline').text().trim()
              });
              if (newArticle.storyUrl) {
                if (savedArticles.includes(newArticle) || newArticleArr.includes(newArticle)) {
                  return false;
                } else {
                  newArticleArr.push(newArticle)
                  db.Article
                    .create(newArticleArr)
                    .then(result => console.log('New Article Created'))
                    .catch(err => {});
                }
              }
            });//end of each function
          })
          .catch(err => {})
    })
    .then(() => {
      setTimeout(function () {
        let headlineArr = newArticleArr.map(article => article.headline)
        console.log('====================================================')
        console.log('====================================================')
        console.log('====================================================')
        console.log('====================================================')
        console.log('====================================================')
        console.log('====================================================')
        console.log('====================================================')
        console.log(headlineArr)
        res.json({count: newArticleArr.length})
        console.log('====================================================')
        console.log('====================================================')
        console.log('====================================================')
        console.log('====================================================')
        console.log('====================================================')
        console.log('====================================================')
      }, 2000)
    })
    .catch(err => console.log('Err from find at the beginning of scrape:',err))


//////////////////end of find()///////////////////////
});// end of get request to /scrape

module.exports = router;
