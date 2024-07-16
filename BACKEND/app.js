const express = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require('./routes/places-routes');
// We provide relative path here.
const HttpError = require('./models/http-error');
const usersRoutes = require('./routes/users-routes');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});


// app.use(placesRoutes); // This is our middleware
app.use('/api/places', placesRoutes); // => /api/places...
// Express.js will now only forward requests to our places routes middleware,
// so to the routes configured here if their path starts with /api/places.

app.use('/api/users', usersRoutes);

// We are adding this after the other routes, bcz if we didnt send res for one of the route. Then only we will trigger this.
// This middleware is only reached if we have some request which didn't get a response
app.use((req, res, next) => { // for handling errors for the unsupported routes
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => { // its a error handling middleware function. Its from express js.
    if (res.headerSent) { // we check if a response has already been sent,
      return next(error);
    }
    res.status(error.code || 500)
    res.json({message: error.message || 'An unknown error occurred!'});
  });

  mongoose
  .connect('mongodb+srv://mern_app:root@cluster0.mlgdtgx.mongodb.net/mern?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    app.listen(5000);
  })
  .catch(err => {
    console.log(err);
  });