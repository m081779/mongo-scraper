const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const logger = require('morgan');
const path = require('path');
const favicon = require('serve-favicon');

//initializing the app
const app = express();

//setting up the database
const config = require('./config/database');
mongoose.Promise = Promise;
mongoose
  .connect(config.database)
  .then( result => {
    console.log(`Connected to database '${result.connections[0].name}' on ${result.connections[0].host}:${result.connections[0].port}`)
  })
  .catch(err => console.log('There was an error with your connection:', err));

//setting up favicon middleware
app.use(favicon(path.join(__dirname, 'public', 'assets/img/favicon.ico')))

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
const scrape = require('./routes/scrape')
app.use('/', routes);
app.use('/scrape', scrape);

//starting server
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`Listening on http://localhost:${PORT}`)
});
