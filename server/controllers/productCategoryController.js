const ProductCategory = require('../models/productCategoryModel.js')
const Product = require('../models/productModel.js')

const getProductCategories = async (req, res) => {
    let queries = {}
    const { q } = req.query
    if(q) {
        queries.category = {$regex: `${q}`, $options: "i"}
    }   
    try {
        const categories = await ProductCategory.find(queries).sort({createdAt: -1})
        res.status(200).json({
            message: 'Berhasil query produk kategori',
            data: categories,
            ok: true
        })
    } catch (error) {
        res.status(400).json({
            message: 'Gagal query produk kategori',
            ok: false
        })
    }
}

const getProductCategory = async (req, res) => {
    try {
        const category = await ProductCategory.findOne({_id: req.params.categoryId})
        res.status(200).json({
            message: 'Berhasil query produk kategori',
            data: category,
            ok: true
        })
    } catch (error) {
        res.status(400).json({
            message: 'Gagal query produk kategori',
            ok: false
        })
    }
} 

const addProductCategory = async (req, res) => {
    try {
        await ProductCategory.create({...req.body})
        res.status(201).json({
            message: 'Berhasil menambahkan produk kategori',
            ok: true
        })
    } catch (error) {
        let message = 'Gagal menambahkan produk kategori'
        if(error.code === 11000) {
            message = 'Kategori sudah pernah ditambahkan sebelumnya'
        }
        res.status(400).json({
            message: message,
            ok: false
        })
    }
}

const updateProductCategory = async (req, res) => {
    try {
        await ProductCategory.updateOne({_id: req.params.categoryId}, {
            category: req.body.newCategory
        })
        if(req.body.oldCategory !== req.body.newCategory) {
            await Product.updateMany({category: req.body.oldCategory}, {
                category: req.body.newCategory
            })
        }   
        res.status(200).json({
            message: 'Berhasil update produk kategori',
            ok: true
        })
    } catch (error) {
        res.status(400).json({
            message: 'Gagal update produk kategori',
            ok: false
        })
    }
}

const deleteProductCategory = async (req, res) => {
    try {
        await ProductCategory.deleteOne({_id: req.params.categoryId})
        res.status(200).json({
            message: 'Berhasil menghapus produk kategori',
            ok: true
        })
    } catch (error) {
        res.status(400).json({
            message: 'Gagal menghapus produk kategori'
        })
    }
}


module.exports = {
    getProductCategories,
    getProductCategory,
    addProductCategory,
    updateProductCategory,
    deleteProductCategory
}