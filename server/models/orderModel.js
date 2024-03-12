const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema({
    orders: [
        {
            item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Products'
            },
            count: {
                type: Number,
                required: true
            }
        }
    ],
    total_price: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    recipient: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone_number: {
            type: String,
            required: true
        }
    },
    shipping_address: {
        full_address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        province: {
            type: String,
            required: true
        },
        postal_code: {
            type: Number,
            required: true
        },
    },
    status: {
        type: String,
        enum: ['Pending', 'Cancelled', 'In progress', 'Shipping', 'Delivered', 'Completed'],
        default: 'Pending',
        required: true
    }
})

const Order = mongoose.model('Orders', orderSchema)
module.exports = Order