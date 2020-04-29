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


/**
 * Mongo DB connection establishment
 */
mongoose.connect(process.env.DB_URL, { dbName: "Store", useNewUrlParser: true, useUnifiedTopology: true }, (err) => {

  if (err) console.log(err)

  else console.log('connected to db')

});


/**
 * create write stream in append mode for logs
 */
// const  accessLogStream = rfs.createStream('access.log', {

//   interval: '1d', // rotate daily

//   path: path.join(__dirname, 'log')

// })

// app.use(morgan('combined'), {stream: accessLogStream})

/**
 * Login view engine userinterface call
 */
app.get('/', (req, res, next) => {

  res.render('login')

});

/**
 * Server connection for our app
 */
app.listen(port, () => console.log('Server is up and listening in port ' + port));
