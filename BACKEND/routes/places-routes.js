// Idea is that in these files, I set up the middleware or I register the middleware that is 
// responsible for handling routes related to places 

const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => { 
  // This is our middleware function in which we always have 3 params.
  console.log('GET Request in Places');
  res.json({message: 'It works!'}); 
  // In the above line we are not doing res.send, though this time will send a json data.
  // As we the REST API`s we will exchange data in the JSON format
});

module.exports = router;
// We need to export this configuration so that we can use it in the app.js
// This simply means the thing which we export in this file is this router constant, so this configured
// router object in the end, this is what we export in this places-routes.js file.