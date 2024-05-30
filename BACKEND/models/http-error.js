class HttpError extends Error {
  // Here, Error is a built in functionality.
  constructor(message, errorCode) {  // We make this to make an object based on it.
    super(message); // Add a "message" property. Using super to call the constructor of the base class.
    this.code = errorCode; // Adds a "code" property
  }
}

module.exports = HttpError;