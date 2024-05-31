const express = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require('./routes/places-routes');
// We provide relative path here.

const app = express();
app.use(bodyParser.json());


// app.use(placesRoutes); // This is our middleware
app.use('/api/places', placesRoutes); // => /api/places...
// Express.js will now only forward requests to our places routes middleware,
// so to the routes configured here if their path starts with /api/places.

app.use((error, req, res, next) => { // its a error handling middleware function. Its from express js.
    if (res.headerSent) { // we check if a response has already been sent,
      return next(error);
    }
    res.status(error.code || 500)
    res.json({message: error.message || 'An unknown error occurred!'});
  });

app.listen(5000);