// All the middleware logic is being moved here.
const uuid = require('uuid/v4');
const HttpError = require("../models/http-error");

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: "20 W 34th St, New York, NY 10001",
    creator: "u1",
  },
];

const getPlaceById = (req, res, next) => {
  // Here, '/pid' handles all the values even if they are not valid.
  // This is our middleware function in which we always have 3 params.
  const placeId = req.params.pid; // { pid: 'p1' }
  const place = DUMMY_PLACES.find((p) => {
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
      throw new HttpError("Could not find a place for the provided id.", 404);
    }
  }

  res.json({ place }); // => { place } => { place: place }
  // In the above line we are not doing res.send, though this time will send a json data.
  // As we the REST API`s we will exchange data in the JSON format
};

// function getPlaceById() { ... }
// const getPlaceById = function() { ... }

const getPlaceByUserId = (req, res, next) => {
  // Now if we have /api/place/user then also the previous router will handle it. As it takes even invalid ids.
  // And this is an issue.
  const userId = req.params.uid;

  const place = DUMMY_PLACES.find((p) => {
    return p.creator === userId;
  });

  if (!place) {
    // const error = new Error('Could not find a place for the provided user id.');
    // error.code = 404;
    // return next(error);
    // We return so that it wont go to the further lines.
    //  next does not cancel it so we have to return to then thereafter make sure this code doesn't run.
    return next(
      new HttpError("Could not find a place for the provided user id.", 404)
    );
  }
  res.json({ place });
};

const createPlace = (req, res, next) => {
  const { title, description, coordinates, address, creator } = req.body;
  // In post, request always have a body. Now to get the data out of the body we use body-parser.
  // const title = req.body.title;
  const createdPlace = {
    id: uuid(),
    title, // we can also do title: title also. We use the short cut when we have same property name.
    location: coordinates,
    address,
    creator
  };

  DUMMY_PLACES.push(createdPlace); //unshift(createdPlace)

  res.status(201).json({place: createdPlace}); // 201 =  successfully creted on the server.
  // Here we are returning json having an object into it, in which we have place holding createdPlace.
};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
