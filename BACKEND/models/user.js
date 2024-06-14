const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;


const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, 
    password: { type: String, required: true, minlength: 6 },
    image: { type: String, required: true },
    places: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);
// As a added unique in the email, so we need a internal validation as well for it, tp check if it already exist or not.
// For the same reason we are using this pakage.

module.exports = mongoose.model('User', userSchema);


