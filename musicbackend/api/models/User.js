const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_name: { type: String, required: true},
    password: { type: String, required: true},
    cofirm_password: { type: String, required: true},
    Email: { type: String, required: true},
    birthday: { type: String, required: true},
    phhno: { type: Number, required: true, validate: /^\d{10}$/},
    gender:{ type: String, required: true},
    is_deleted:{type:Boolean,default:false},
});

module.exports = mongoose.model('user', orderSchema);