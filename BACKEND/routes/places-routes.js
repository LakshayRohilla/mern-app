// Idea is that in these files, I set up the middleware or I register the middleware that is
// responsible for handling routes related to places

const express = require("express");
const placesControllers = require("../controllers/places-controllers");

const router = express.Router();
const { check } = require('express-validator'); 

router.get("/:pid", placesControllers.getPlaceById);

router.get("/user/:uid", placesControllers.getPlacesByUserId);

// router.post('/', placesControllers.createPlace);
//This means /api/place will reach to this path.

router.post(
  "/",
  [
    check("title").not().isEmpty(), // this reads like plain English in the end, right, we check that the title is not empty and that overall gives us a new middleware which is added for post
    // requests that target /api/places/
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placesControllers.createPlace
);

// router.patch("/:pid", placesControllers.updatePlace); // if we have another get method with the same path then there will be a clash.
router.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placesControllers.updatePlace
);

router.delete("/:pid", placesControllers.deletePlace);

module.exports = router;
// We need to export this configuration so that we can use it in the app.js
// This simply means the thing which we export in this file is this router constant, so this configured
// router object in the end, this is what we export in this places-routes.js file.

// UPDATE : In this file now we will be having mapping and the paths.
// All the middleware are moved to the controller files.
