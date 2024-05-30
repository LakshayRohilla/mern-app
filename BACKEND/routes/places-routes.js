// Idea is that in these files, I set up the middleware or I register the middleware that is 
// responsible for handling routes related to places 

const express = require('express');
const HttpError = require('../models/http-error');

const router = express.Router();

const DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    location: {
      lat: 40.7484474,
      lng: -73.9871516
    },
    address: '20 W 34th St, New York, NY 10001',
    creator: 'u1'
  }
];

router.get('/:pid', (req, res, next) => {
  // Here, '/pid' handles all the values even if they are not valid.
  // This is our middleware function in which we always have 3 params.
  const placeId = req.params.pid; // { pid: 'p1' }
  const place = DUMMY_PLACES.find(p => {
    return p.id === placeId;
  });

  if (!place) {
    // const error = new Error('Could not find a place for the provided id.');
    // error.code = 404;
    // throw error;
    // Above is one way to trigger the error handling middleware.
    // When throwing an error, you don't have to return because if you use throw, that already cancels the function execution, next does not cancel it so we have to return to then thereafter make sure this code doesn't run.
    // Another is the next() function and pass an error to it.
    // When we are in async code we have to use next and then pass error to it. next(error)            
    if (!place) {
      throw new HttpError('Could not find a place for the provided id.', 404);
    }                                                                 
  }

  res.json({place}); // => { place } => { place: place }
  // In the above line we are not doing res.send, though this time will send a json data.
  // As we the REST API`s we will exchange data in the JSON format
});

router.get('/user/:uid', (req, res, next) => {
  // Now if we have /api/place/user then also the previous router will handle it. As it takes even invalid ids.
  // And this is an issue.
  const userId = req.params.uid;

  const place = DUMMY_PLACES.find(p => {
    return p.creator === userId;
  });

  if (!place) {
    // const error = new Error('Could not find a place for the provided user id.');
    // error.code = 404;
    // return next(error); 
    // We return so that it wont go to the further lines.
    //  next does not cancel it so we have to return to then thereafter make sure this code doesn't run.
    return next(
      new HttpError('Could not find a place for the provided user id.', 404)
    );
  }
  res.json({ place });
});

module.exports = router;
// We need to export this configuration so that we can use it in the app.js
// This simply means the thing which we export in this file is this router constant, so this configured
// router object in the end, this is what we export in this places-routes.js file.