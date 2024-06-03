// Idea is that in these files, I set up the middleware or I register the middleware that is 
// responsible for handling routes related to places 

const express = require('express');
const placesControllers = require('../controllers/places-controllers');

const router = express.Router();

router.get('/:pid', placesControllers.getPlaceById);

router.get('/user/:uid', placesControllers.getPlaceByUserId);

router.post('/', placesControllers.createPlace);
//This means /api/place will reach to this path.

module.exports = router;
// We need to export this configuration so that we can use it in the app.js
// This simply means the thing which we export in this file is this router constant, so this configured
// router object in the end, this is what we export in this places-routes.js file.

// UPDATE : In this file now we will be having mapping and the paths.
// All the middleware are moved to the controller files.