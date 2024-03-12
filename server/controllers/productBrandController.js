const ProductBrand = require('../models/productBrandModel')
const Product = require('../models/productModel')

const getProductBrands = async (req, res) => {
    let queries = {}
    const {q} = req.query
    if(q) {
        queries.brand = {$regex: `${q}`, $options: "i"}
    }
    try {
        const brands = await ProductBrand.find(queries).sort({createdAt: -1})
        res.status(200).json({
            message: 'Berhasil query data brands',
            data: brands,
            ok: true
        })
    } catch (error) {
        res.status(400).json({
            message: 'Gagal query data brands',
            ok: false
        })
    }
}

const getProductBrand = async (req, res) => {
    try {
        const brand = await ProductBrand.findOne({_id: req.params.brandId})
        res.status(200).json({
            message: 'Berhasil query single data brand',
            data: brand,
            ok: true
        })
    } catch (error) {
        res.status(400).json({
            message: 'Gagal query single data brand',
            ok: false
        })
    }
}

const addProductBrand = async (req, res) => {
    try {
        await ProductBrand.create({brand: req.body.brand})
        res.status(201).json({
            message: 'Berhasil menambahkan data brand baru',
            ok: true
        })
    } catch (error) {
        let message = 'Gagal menambahkan data brand baru'
        if(error.code === 11000) {
            message = 'Brand sudah pernah ditambahkan sebelumnya'
        }
        res.status(400).json({
            message: message,
            ok: false
        })        
    }
}

const updateProductBrand = async (req, res) => {
    try {
        await ProductBrand.updateOne({_id: req.params.brandId}, {
            brand: req.body.newBrand
        })
        if(req.body.oldBrand !== req.body.newBrand) {
            await Product.updateMany({brand: req.body.oldBrand}, {
                brand: req.body.newBrand
            })
        }
        res.status(200).json({
            message: 'Berhasil melakukan update data brand',
            ok: true
        })
    } catch (error) {
        res.status(400).json({
            message: 'Gagal melakukan update data brand',
            ok: false
        })        
    }
}

const deleteProductBrand = async (req, res) => {
    try {
        await ProductBrand.deleteOne({_id: req.params.brandId})
        res.status(200).json({
            message: 'Berhasil menghapus data brand',
            ok: true
        })
    } catch (error) {
        res.status(400).json({
            message: 'Gagal menghapus data brand',
            ok: false
        })        
    }
}


module.exports = {
    getProductBrands,
    getProductBrand,
    addProductBrand,
    updateProductBrand,
    deleteProductBrand
}