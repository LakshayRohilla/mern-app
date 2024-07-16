// This is a config file for the multer.

const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const MIME_TYPE_MAP = { // kind of file we're dealing with.
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};

const fileUpload = multer({ // Here we are configuring the multer to store the file that we are receiving & which file to accept.
  limits: 500000, // limit of the file, its in bytes.
  storage: multer.diskStorage({ // how data should be stored.
    destination: (req, file, cb) => { // destination wherr file should store.
      cb(null, 'uploads/images');
      // I got no error, so I'll pass null as a first argument.
    },
    filename: (req, file, cb) => { // also a file name key to control the file name that's being used.
      const ext = MIME_TYPE_MAP[file.mimetype]; // extention of the incoming file. file itself have the minetype in it.
      cb(null, uuidv4() + '.' + ext);
      // I got no error, so I'll pass null as a first argument.
      // this generates a random file name with the right extension.
    }
  }),
  fileFilter: (req, file, cb) => { // this we are doing for the validation.
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error('Invalid mime type!');
    // remember we take null in the case when there is no error.
    cb(error, isValid);
  }
});

module.exports = fileUpload;
