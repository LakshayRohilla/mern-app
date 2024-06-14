// All the middleware logic is being moved here.
// const uuid = require('uuid/v4');
const { v4: uuidv4 } = require('uuid');
const HttpError = require("../models/http-error");
const { validationResult } = require('express-validator');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');

let DUMMY_PLACES = [
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

const getPlaceById = async (req, res, next) => {
  // Here, '/pid' handles all the values even if they are not valid.
  // This is our middleware function in which we always have 3 params.
  const placeId = req.params.pid; // { pid: 'p1' }
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a place.',
      500
    );
    return next(error);
  }


  if (!place) {
    // const error = new Error('Could not find a place for the provided id.');
    // error.code = 404;
    // throw error;
    // Above is one way to trigger the error handling middleware.
    // When throwing an error, you don't have to return because if you use throw, that already cancels the function execution, next does not cancel it so we have to return to then thereafter make sure this code doesn't run.
    // Another is the next() function and pass an error to it.
    // When we are in async code we have to use next and then pass error to it. next(error)
    if (!place) {
      const error = new HttpError(
        'Could not find a place for the provided id.',
        404
      );
      return next(error);
    }
  }

  res.json({ place: place.toObject({ getters: true }) }); // => { place } => { place: place }
  // In the above line we are not doing res.send, though this time will send a json data.
  // As we the REST API`s we will exchange data in the JSON format
};

// function getPlaceById() { ... }
// const getPlaceById = function() { ... }

const getPlacesByUserId = async(req, res, next) => {
  // Now if we have /api/place/user then also the previous router will handle it. As it takes even invalid ids.
  // And this is an issue.
  const userId = req.params.uid;

  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a place.',
      500
    );
    return next(error);
  }

  if (!places || places.length==0) {
    // const error = new Error('Could not find a place for the provided user id.');
    // error.code = 404;
    // return next(error);
    // We return so that it wont go to the further lines.
    //  next does not cancel it so we have to return to then thereafter make sure this code doesn't run.
    return next(
      new HttpError('Could not find places for the provided user id.', 404)
    );
  }
  res.json({ places: places.map(place => place.toObject({ getters: true })) }); // bcz find returns a array.
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // When we work with the async code throw wont work properly so that why we will be using next here.
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  // const { title, description, address, location, creator } = req.body; // by this we can receive the location in the req body.
  // In post, request always have a body. Now to get the data out of the body we use body-parser.
  const { title, description, address, creator } = req.body;
  
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error); // return so that no code ofter this runs.
  }

  // const title = req.body.title;
  const createdPlace = new Place({
    title, // we can also do title: title also. We use the short cut when we have same property name.
    description,
    address,
    location: coordinates,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/400px-Empire_State_Building_%28aerial_view%29.jpg',
    creator
  });

  // DUMMY_PLACES.push(createdPlace); //unshift(createdPlace)
  try {
    await createdPlace.save(); // as save also return promise. Hence its a async task. So we can use await here.
  } catch (err) {
    const error = new HttpError(
      'Creating place failed, please try again.',
      500
    );
    return next(error); // to stop code execution if we have error here.
  }

  res.status(201).json({place: createdPlace}); // 201 =  successfully creted on the server.
  // Here we are returning json having an object into it, in which we have place holding createdPlace.
};


const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed, please check your data.', 422);
  }
  const { title, description } = req.body;
  const placeId = req.params.pid; // pid we are getting from the url, thats why we are using the params as we are getting this data from the parameters.

  // const updatedPlace = { ...DUMMY_PLACES.find(p => p.id === placeId) }; // here we are making a copy of the object using {...}
  // const updatedPlace = DUMMY_PLACES.find(p => p.id === placeId);
  // Over here what we could do is : updatedPlace.title = newTitle , updatedPlace.description = description. But its not the optimised way manipulating the array.

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update place.',
      500
    );
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update place.',
      500
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) }); // converting mongoose object to JS object
};

const deletePlace = async(req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete place bcz we didnt find it.',
      500
    );
    return next(error);
  }

  try {
    await place.deleteOne();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete place.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted place.' });
};


exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;