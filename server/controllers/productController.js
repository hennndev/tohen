const Product = require('../models/productModel')
const ProductCategory = require('../models/productCategoryModel')
const ProductBrand = require('../models/productBrandModel')
const cloudinary = require('cloudinary').v2
const Mongoose = require('mongoose')

cloudinary.config({
    cloud_name: 'dyvxku1wk',
    api_key: '473747957291284',
    api_secret: 'acUg7epEOn0aFSl-57xk5FEut_I'
})
const DATA_LIMIT = process.env.DATA_LIMIT

// MENAMPILKAN SEMUA PRODUK
const getProducts = async (req, res) => {
    const { q, category, brand, discount, condition, tag, lowest_price, highest_price, page, sort } = req.query
    let queries = {
        page: 1
    }
    let sorting = {}
    // nama 
    if(q) {
        queries.name = {$regex: `${q}`, $options: "i"}
    }
    // harga
    if(lowest_price && !highest_price) {
        queries.price = {$gte: +lowest_price}
    }
    if(highest_price && !lowest_price) {
        queries.price ={$lte: +highest_price}
    }
    if(highest_price && lowest_price) {
        queries.price = {$gte: +lowest_price, $lte: +highest_price}
    }
    // kondisi (new/old)
    if(condition) {
        queries.condition = {$in: condition.split(',')}
    }
    // kategori
    if(category) {
        queries.category = {$in: category.split(',')}
    }
    // brand
    if(brand) {
        queries.brand = {$in: brand.split(',')}
    }
    // tag
    if(tag) {
        queries['tags.name'] = {$in: tag.split(',')}
    }
    // page
    if(page) {
        queries.page = page
    }
    // sort
    if(sort) {
        if(sort.includes('price')) {
            sorting.price = sort === 'by-lowest-price' ? 1 : -1
        } else if(sort.includes('product')) {
            sorting.createdAt = sort === 'newest-product' ? -1 : 1
        } else if(sort.includes('discount')) {
            sorting['discount.is_discount'] = -1
            sorting.createdAt = -1
        }
    }  else {
        sorting.createdAt = -1
    }
    try {
        const data = await Product.find(queries).sort(sorting).skip((page * DATA_LIMIT) - DATA_LIMIT).limit(DATA_LIMIT).lean()
        const productsCount = await Product.find(queries).countDocuments() //jumlah product yang akan ditampilkan saat kondisi itu juga
        res.status(200).json({
            message: 'Success get products',
            data: data,
            productsCount: productsCount,
            ok: true
        })
    } catch (error) {
        res.status(400).json({
            message: 'Failed get products',
            ok: false
        })
    }
}

//MENAMPILKAN PRODUK DETAIL
const getProduct = async (req, res) => {
    try {
        const data = await Product.findOne({_id: req.params.productId}) //find berdasarkan produk id
        res.status(200).json({
            message: 'Success get product',
            data: data,
            ok: true
        })
    } catch (error) {
        res.status(400).json({
            message: 'Failed get product',
            ok: false
        })
    }
}

//MENAMBAH DATA PRODUK BARU
const addProduct = async (req, res) => {
    try {
        const product = await Product.create({
            ...req.body
        })
        //Menambah produk id sebagai foreign key ke dalam categories data
        await ProductCategory.updateOne({category: req.body.category}, {
            $push: {products: product._id}
        })
        //Menambah produk id sebagai foreign key ke dalam brands data
        await ProductBrand.updateOne({brand: req.body.brand}, {
            $push: {products: product._id}
        })
        res.status(201).json({
            message: 'Success add new product',
            ok: true
        })
    } catch (error) {
        res.status(400).json({
            message: 'Failed add new product',
            ok: false
        })
    }
}

//MENGEDIT DATA PRODUK
const updateProduct = async (req, res) => {
    const { oldImageId, discount, ...productData } = req.body
    try {
        //Jika image produk akan diganti, maka dilakukan pengkondisian berdasarkan apakah ada id pada old image
        if(oldImageId) {
            //kemudian remove image yang disimpan pada clodinary
            await cloudinary.uploader.destroy(oldImageId)
        }
        const previousData = await Product.findOne({_id: req.params.productId}) //cek produk sebelum diedt
        await Product.updateOne({_id: req.params.productId}, {
            ...productData,
            discount: {
                is_discount: discount === 0 ? false : true,
                discount_percentage: discount
            }
        })
        //Cek apakah seteleh edit produk, data kategori masih sama atau tidak
        if(previousData.category !== productData.category) {
            await ProductCategory.updateOne({category: previousData.category}, {
                $pull: {products: req.params.productId}
            })
            await ProductCategory.updateOne({category: productData.category}, {
                $push: {products: req.params.productId}
            })
        }
        //Cek apakah seteleh edit produk, data brand masih sama atau tidak
        if(previousData.brand !== productData.brand) {
            await ProductBrand.updateOne({brand: previousData.brand}, {
                $pull: {products: req.params.productId}
            })
            await ProductBrand.updateOne({brand: productData.brand}, {
                $push: {products: req.params.productId}
            })
        }
        res.status(200).json({
            message: 'Success update product',
            ok: true
        })
    } catch (error) {
        res.status(400).json({
            message: 'Failed update product',
            ok: false
        })
    }
}

//MENGHAPUS DATA PRODUK
const deleteProduct = async (req, res) => {
    try {
        //Hapus image yang ada di cloudinary
        await cloudinary.uploader.destroy(req.body.imageId)
        //Hapus data produk yang ada di MongoDB
        await Product.deleteOne({_id: req.params.productId})
        //Edit data kategori untuk menghapus produk id foreign key
        await ProductCategory.updateOne({category: req.body.category}, {
            $pull: {products: req.params.productId}
        })
        //Edit data brands untuk menghapus produk id foreign key
        await ProductBrand.updateOne({brand: req.body.brand}, {
            $pull: {products: req.params.productId}
        })
        res.status(200).json({
            message: 'Success delete product',
            ok: true
        })
    } catch (error) {
        res.status(400).json({
            message: 'Failed delete product',
            ok: false
        })
    }
}

//MENGECEK STOK PRODUK
const checkProductsInStock = async (req, res) => {
    try {
        const productsData = await Product.find({
            _id: {$in: req.body.products.map(product => new Mongoose.Types.ObjectId(product._id))}
        }).select('_id name stock').lean() //format to array

        const objProducts = req.body.products.reduce((obj, item) => {
            return Object.assign(obj, {
                [item._id]: {count: item.count}
            })
        }, {})

        const productsOutStock = productsData.filter(product => {
            return product.stock < objProducts[product._id].count
        })
        res.status(200).json({
            message: 'Success getting info products in stock',
            productsOutStock: productsOutStock,
            ok: true
        })
    } catch (error) {
        res.status(400).json({
            message: 'Failed getting info products in stock',
            ok: false
        })
    }
}

module.exports = {
    getProducts,
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    checkProductsInStock
}


// =====ALL CLEAR=====