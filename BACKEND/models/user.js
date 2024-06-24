const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;


const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, 
    password: { type: String, required: true, minlength: 6 },
    image: { type: String, required: true },
    places: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Place'}]
    // we said that one user can have multiple places. Therefore we have to add an array here.
    // This is how we tell Mongoose that in documents based on the schema, we have multiple places entries instead of just one value.
});

userSchema.plugin(uniqueValidator);
// As a added unique in the email, so we need a internal validation as well for it, tp check if it already exist or not.
// For the same reason we are using this pakage.

module.exports = mongoose.model('User', userSchema);


