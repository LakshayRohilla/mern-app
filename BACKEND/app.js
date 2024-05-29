const express = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require('./routes/places-routes');
// We provide relative path here.

const app = express();

app.use(placesRoutes); // This is our middleware

app.listen(5000);