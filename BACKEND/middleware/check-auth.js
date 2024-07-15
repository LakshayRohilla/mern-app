const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') { // we need to do this bcz we face auth error. Check obsidian for more info
    // So this is a required adjustment to ensure that our options request is not blocked.
    return next(); 
  } 
  try {
    const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN' // We will get an array as an output from this. Containing Bearer string & TOKEN.
    // req.headers is automatically provided by express JS.
    // We added authorization header in the app.js file, so that we allow user also to add it.
    // encoding the token in the headers of the incoming request so we can access the request object and there we will find a headers property.
    if (!token) {
      throw new Error('Authentication failed!');
    }
    const decodedToken = jwt.verify(token, 'supersecret_dont_share'); // it returns a payload(string or an object)
    // when we created the token, we stored the user ID and the email in the token. 
    req.userData = { userId: decodedToken.userId }; // from that payload we can therefore also get the user ID to which this token belongs.
    // You can always dynamically add data to the request object like this.
    next(); // allow the request to continue its journey so that it is able to reach any other routes thereafter that require authentication
  } catch (err) {
    const error = new HttpError('Authentication failed!', 401);
    return next(error);
  }
};

// 1. We get the token.
// 2. We decode the received token.
