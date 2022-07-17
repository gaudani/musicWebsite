const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    artist_name: { type: String, required: true,unique: true},
    Email:{ type: String, required: true },
    artist_Image: { type: String, required: true },
    songs:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'songs', required: true }],
});

module.exports = mongoose.model('artist', productSchema);