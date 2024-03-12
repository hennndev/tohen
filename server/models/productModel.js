const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        image_url: {
            type: String,
            required: true
        },
        image_id: {
            type: String,
            required: true
        }
    },
    category: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    condition: {
        type: String,
        enum: ['baru', 'bekas'],
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    specifications: {
        type: Array,
        default: []
    },
    discount: {
        is_discount: {
            type: Boolean,
            default: false
        },
        discount_percentage: {
            type: Number,
            default: 0
        } 
    },
    tags: [
        {
            name: {
                type: String
            }
        }
    ],
    ratings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Reviews'
        }
    ]
}, {
    timestamps: true
})

const Product = mongoose.model('Products', productSchema)
module.exports = Product