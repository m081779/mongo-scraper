const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const logger = require('morgan');
const path = require('path');

//initializing the app
const app = express();

//setting up the database

const config = require('./config/database');
mongoose.Promise = Promise;
mongoose.connect(config.database, err =>{
  if (err){
    console.log('Connection failed!');
  } else {
    console.log('Connected to MongoDB...');
  }
});


//setting up Morgan middleware
app.use(logger('dev'));

//setting up the static directory
app.use(express.static(path.join(__dirname, '/public')));


//setting up body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//setting up handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//setting up routes
const routes = require('./routes/routes')
app.use('/', routes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`Listening on http://localhost:${PORT}`)
});
