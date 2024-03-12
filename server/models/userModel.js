const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    }, 
    email: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    role: {
        type: String,
        enum: ['customer', 'admin'],
        required: true
    },
    photo: {
        photo_id: {
            type: String, 
            default: null
        },
        photo_url: {
            type: String,
            default: null
        }
    },
    personal_information: {
        full_address: {
            type: String,
            default: null
        },
        city: {
            type: String,
            default: null
        },
        province: {
            type: String,
            default: null 
        },
        region: {
            type: String,
            default: null
        },
        postal_code: {
            type: Number,
            default: null
        },
        phone_number: {
            type: String,
            default: null
        }
    },
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products'
        }
    ],
    orders_history: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Orders'
        }
    ]
}, {
    timestamps: true
})

const User = mongoose.model('Users', userSchema)
module.exports = User