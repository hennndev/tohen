const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productReviewSchema = new Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    rating: {
        type: Number,
        default: null
    },
    is_rating: {
        type: Boolean,
        default: false
    },
    review: {
        type: String,
        default: null
    }
})

const ProductReview = mongoose.model('Reviews', productReviewSchema)
module.exports = ProductReview