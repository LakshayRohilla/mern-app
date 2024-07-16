const express = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require('./routes/places-routes');
// We provide relative path here.
const HttpError = require('./models/http-error');
const usersRoutes = require('./routes/users-routes');
const mongoose = require('mongoose');
const fs = require('fs'); // file system module, using this we can interact with the FS and can delete files as well
const path = require('path');

const app = express();
app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images'))); // express.static -> returns a static file.
// files in this path will be returned. 

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
  if (req.file) { // by this we can check if there is a file exist.
    fs.unlink(req.file.path, err => { // unlink deletes the file.
      console.log(err);
    });
  }  
  if (res.headerSent) { // we check if a response has already been sent,
      return next(error);
    }
    res.status(error.code || 500)
    res.json({message: error.message || 'An unknown error occurred!'});
  });

  mongoose
  .connect('mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD@cluster0.mlgdtgx.mongodb.net/${process.env.DB_NAME?retryWrites=true&w=majority&appName=Cluster0')
  // Process is provided by node JS, and its always available globally. When we try to access "process.env" then nodemon inject the values we ask for.
  .then(() => {
    app.listen(5000);
  })
  .catch(err => {
    console.log(err);
  });