const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_name: { type: String, required: true,unique: true},
    password: { type: String, required: true},
    Email: { type: String, required: true},
    is_deleted:{type:Boolean,default:false},
});

module.exports = mongoose.model('adminUser', orderSchema);