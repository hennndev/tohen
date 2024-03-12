const mongoose = require('mongoose')
const Schema = mongoose.Schema

export const expenseManagerSchema = new Schema({
    transaction: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Planning', 'Done'],
        required: true,
    }
}, {
    timestamps: true
}) 

module.exports = mongoose.model('ExpensesManager', expenseManagerSchema)