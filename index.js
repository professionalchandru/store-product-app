const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config()
const app = express();

//middlewares
app.use(express.json());
mongoose.set('useCreateIndex', true);

//Import routes
const userRoute = require('./routes/user');
const productRoute = require('./routes/products');

//Route middlewares
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);


//Mongo db connection
mongoose.connect(process.env.DB_URL, { dbName: "Store", useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) console.log(err)
    else console.log('connected to db')
})


//Server listening for connection
app.listen(3000, () => console.log('Server is up and listening in port 3000'));