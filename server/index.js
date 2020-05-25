const express                          = require('express');

const mongoose                         = require('mongoose');

const methodOverride                   = require('method-override');

const exphbs                           = require('express-handlebars');

const bodyParser                       = require('body-parser');

const dotenv                           = require('dotenv').config();

const redis                            = require('redis');

const path                             = require('path');

const rfs                               = require('rotating-file-stream');

const cookieParser                     = require('cookie-parser');

const morgan                           = require('morgan');

const port                             = process.env.PORT || 3000;

const client                           = redis.createClient();

const cors                             = require('cors');

const app                              = express();

/**
 * redis server connection on
 * @returns connection status
 */
client.on('connect', () => console.log('redis server is up...'));

/**
 * View engine initialization
 */
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));

app.set('view engine', 'handlebars');

/**
 * middlewares needed by this app
 */
app.use(express.json());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(cors());

mongoose.set('useCreateIndex', true);

/**
 * method override fuction to override http methods
 */
app.use(methodOverride('_method'));

/**
 * different routes used in our app
 */
const userRoute                         = require('./routes/user');

const productRoute                      = require('./routes/products');

/**
 * Route middlewares access routes
 */
app.use('/api/users', userRoute);

app.use('/api/products', productRoute);

// Handle in production
if(process.env.NODE_ENV === 'production'){

  // static folder
  app.use(express.static(__dirname + '/public/'));

  // Handle SPA
  app.get(/.*/, (req, res) => {

      res.sendFile(__dirname + '/public/index.html');

  })
}

/**
 * Mongo DB connection establishment
 */
const db = mongoose.connect(process.env.DB_URL, { dbName: "Store", useNewUrlParser: true, useUnifiedTopology: true }, (err) => {

  if (err) console.log(err)

  else console.log('connected to db')

});

/**
 * Server connection for our app
 */
app.listen(port, () => console.log('Server is up and listening in port ' + port));
