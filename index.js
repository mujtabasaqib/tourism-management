const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose')
const cors = require('cors')
//import routes here
const path = require('path');
const app = express();
const port = 3000;
//const bcrypt = require('bcrypt');
//const session = require('express-session');
const CONNECTION_STRING = 'mongodb://localhost:27017/database_name';

mongoose.connect(CONNECTION_STRING)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

//view engine
//app.set('view engine', 'ejs');
//app.set('views', 'views');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
//app.use(express.static(path.join(__dirname, 'public')));
//app.use('/api/books', bookRoutes); //routes

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
})
