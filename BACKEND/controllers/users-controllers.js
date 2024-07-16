// const uuid = require('uuid/v4');
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const HttpError = require("../models/http-error");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later.",
      500
    );
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again.",
      500
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    places: [], // because the starting value for the places will be an empty array. As one user can have multiple places.
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign( // sign method here returns a string in the end and this string will be the token.
      { userId: createdUser.id, email: createdUser.email }, // payload of the token. So the data you want to encode into the token in this can be a string, an object or a buffer.
      // user id, to understand which user it belongs to. D is a getter provided by Mongoose on every created user document object(collection) we're working with.
      'supersecret_dont_share',  // private key ,  a string which only the server knows.
      { expiresIn: '1h' } // the last argument is optional. And here you can configure the token with a JavaScript object where you can set up certain options.
      // For example, you can set a token expiration with expires in.
    );
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  // res.status(201).json({ user: createdUser.toObject({ getters: true }) });
  // some user data which I want to return
  // instead of the entire user object because not all user data is directly required in the frontend here.
  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password); // plain password , hasded password from the DB.
    // From compare we always return a boolean value.
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again.",
      500
    );
    return next(error);
  }
  if (!isValidPassword) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign( 
      { userId: existingUser.id, email: existingUser.email }, 
      'supersecret_dont_share', // keep in mind for the login and signup keys should be the same.
      { expiresIn: '1h' } 
    );
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  // res.json({
  //   message: "Logged in!",
  //   user: existingUser.toObject({ getters: true }),
  // });
  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token //in our case the React application will be able to use and store this token and attach it to future requests to routes on the backend that require authentication.
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
