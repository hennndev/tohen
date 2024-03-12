const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productCategorySchema = new Schema({
    category: {
        type: String,
        required: true,
        unique: true
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products'
        }
    ]
}, {
    timestamps: true
})

module.exports = mongoose.model('Categories', productCategorySchema)