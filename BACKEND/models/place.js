const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const placeSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    address: { type: String, required: true },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
    },
    creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User'} // to have real id from mongoose
    // ref property allows us to establish the connection between our current play schema and another schema.
});

module.exports = mongoose.model('Place', placeSchema);