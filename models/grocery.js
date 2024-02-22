const mongoose = require('mongoose');

const groceryItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    inventory: {
        type: Number,
        required: true,
    },
    status: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true
});

module.exports = mongoose.model('groceries', groceryItemSchema);;