const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true ,unique: true},
    artistName: { type: String, required: true },
    music: { type: String, required: true }
});

module.exports = mongoose.model('songs', productSchema);