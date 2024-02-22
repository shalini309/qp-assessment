const mongoose = require('mongoose');

const groceryItemSchema = new mongoose.Schema({
    items: [
        {
            groceryItemId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'groceries',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
        },
    ],
    totalPrice: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('orders', groceryItemSchema);;