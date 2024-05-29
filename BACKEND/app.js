const express = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require('./routes/places-routes');
// We provide relative path here.

const app = express();

// app.use(placesRoutes); // This is our middleware
app.use('/api/places', placesRoutes); // => /api/places...
// Express.js will now only forward requests to our places routes middleware,
// so to the routes configured here if their path starts with /api/places.

app.listen(5000);