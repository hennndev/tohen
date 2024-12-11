const express = require('express')
const router = express.Router()
const verifyJWT = require('../middleware/verifyJWT')
const verifyAdmin = require('../middleware/verifyAdmin')
const { getProducts, addProduct, updateProduct, deleteProduct, getProduct, checkProductsInStock } = require('../controllers/productController')
const { getProductCategories, addProductCategory, deleteProductCategory, updateProductCategory, getProductCategory } = require('../controllers/productCategoryController')
const { getProductBrands, getProductBrand, addProductBrand, updateProductBrand, deleteProductBrand } = require('../controllers/productBrandController')

// ===PRODUCTS===
router.route('/api/products')
    .get(async(req, res) => await getProducts(req, res)) //request menampilkan products tanpa verify
    .post(verifyAdmin, async(req, res) => await addProduct(req, res)) //request tambah product perlu verify admin login
router.post('/api/products/check-products-in-stock', verifyJWT, async(req, res) => await checkProductsInStock(req, res))
//request cek stok produk memerlukan verify user login

// ===PRODUCT-DETAIL===
router.route('/api/products/:productId')
    .get(async(req, res) => await getProduct(req, res)) //request menampilkan detail produk tanpa verify
    .put(verifyAdmin, async(req, res) => await updateProduct(req, res)) //request edit produk harus verify admin login
    .delete(verifyAdmin, async(req, res) => await deleteProduct(req, res)) //request delete produk harus verify admin login


//===CATEGORIES===
router.route('/api/categories')
    .get(async(req, res) => await getProductCategories(req, res)) //request menampilkan categories tanpa verify
    .post(verifyAdmin, async(req, res) => await addProductCategory(req, res)) //request tambah category harus verify admin login
router.route('/api/categories/:categoryId')
    .get(verifyAdmin, async(req, res) => await getProductCategory(req, res)) //request menampilkan detail category harus verify admin login
    .put(verifyAdmin, async(req, res) => await updateProductCategory(req, res)) //request edit category harus verify admin login
    .delete(verifyAdmin, async(req, res) => await deleteProductCategory(req, res)) //request delete category harus verify admin login


//===BRANDS===
router.route('/api/brands')
    .get(async(req, res) => await getProductBrands(req, res)) //request menampilkan brands tanpa verify
    .post(verifyAdmin, async(req, res) => await addProductBrand(req, res)) //request tambah brand harus verify admin login
router.route('/api/brands/:brandId')
    .get(verifyAdmin, async(req, res) => await getProductBrand(req, res)) //request menampilkan detail brand harus verify admin login
    .put(verifyAdmin, async(req, res) => await updateProductBrand(req, res)) //request edit brand harus verify admin login
    .delete(verifyAdmin, async(req, res) => await deleteProductBrand(req, res)) //request delete brand harus verify admin login

module.exports = router



// =====ALL CLEAR======