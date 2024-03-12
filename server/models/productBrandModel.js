const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const productBrandSchema = new Schema({
    brand: {
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

module.exports = mongoose.model('Brands', productBrandSchema)
