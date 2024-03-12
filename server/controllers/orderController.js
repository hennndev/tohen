const Order = require('../models/orderModel')



//get orders
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('order_by').sort({createdAt: -1}).lean()
        res.status(200).json({
            message: 'Berhasil mendapatkan orders data',
            orders: orders,
            ok: true

        })
    } catch (error) {
        res.status(400).json({
            message: 'Gagal mendapatkan orders data',
            ok: false
        })
    }
}

//add order
const addNewOrder = async (req, res) => {
    try {
        await Order.create({})
        res.status(201).json({
            message: 'Berhasil menambah order baru',
            ok: true
        })
    } catch (error) {
        res.status(400).json({
            message: 'Gagal menambahkan order baru',
            ok: false
        })
    }
} 

const changeStatusOrder = async (req, res) => {
    try {
        res.status(200).json({
            message: 'Success change status order',
            ok: true
        })
    } catch (error) {
        res.status(400).json({
            message: 'Failed change status order',
            ok: false
        })        
    }
}


module.exports = {
    getOrders,
    addNewOrder
}