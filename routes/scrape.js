const express = require('express');
const cheerio = require('cheerio');
const rp = require('request-promise');
const router = express.Router();
const db = require("../models");

router.get("/newArticles", function(req, res) {
  const options = {
    uri: "https://www.nytimes.com/section/us",
    transform: function (body) {
        return cheerio.load(body);
    }
  };
  db.Article
    .find({})
    .then((savedArticles) => {
      let savedHeadlines = savedArticles.map(article => article.headline)

        rp(options)
        .then(function ($) {
          let newArticleArr = [];
          $("#latest-panel article.story.theme-summary").each((i, element) => {
            let newArticle = new db.Article({
              storyUrl: $(element).find('.story-body>.story-link').attr('href'),
              headline: $(element).find('h2.headline').text().trim(),
              summary : $(element).find('p.summary').text().trim(),
              imgUrl  : $(element).find('img').attr('src'),
              byLine  : $(element).find('p.byline').text().trim()
            });
            if (newArticle.storyUrl) {
              if (!savedHeadlines.includes(newArticle.headline)) {
                newArticleArr.push(newArticle);
              }
            }
          });//end of each function
          console.log(newArticleArr.length)
          db.Article
            .create(newArticleArr)
            .then(result => res.json({count: newArticleArr.length}))
            .catch(err => {});
        })
        .catch(err => console.log(err))//end of rp method
    })
    .catch(err => console.log(err))//end of db.Article.find()
});// end of get request to /scrape

module.exports = router;
