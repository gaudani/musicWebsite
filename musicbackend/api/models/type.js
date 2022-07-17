const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    Music_type: { type: String, required: true },
    Image: { type: String, required: true },
    songs:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'songs', required: true }],
});

module.exports = mongoose.model('TypeMusic', productSchema);