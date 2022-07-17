const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    songs:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'songs', required: true }],
});

module.exports = mongoose.model('playlist', productSchema);