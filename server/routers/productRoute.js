const express = require('express')
const router = express.Router()
const verifyJWT = require('../middleware/verifyJWT')
const verifyAdmin = require('../middleware/verifyAdmin')
const { getProducts, addProduct, updateProduct, deleteProduct, getProduct, checkProductsInStock } = require('../controllers/productController')
const { getProductCategories, addProductCategory, deleteProductCategory, updateProductCategory, getProductCategory } = require('../controllers/productCategoryController')
const { getProductBrands, getProductBrand, addProductBrand, updateProductBrand, deleteProductBrand } = require('../controllers/productBrandController')

router.route('/api/products')
    .get(async(req, res) => await getProducts(req, res))
    .post(verifyAdmin, async(req, res) => await addProduct(req, res))

router.post('/api/products/check-products-in-stock', verifyJWT, async(req, res) => await checkProductsInStock(req, res))

router.route('/api/products/:productId')
    .get(async(req, res) => await getProduct(req, res))
    .put(verifyAdmin, async(req, res) => await updateProduct(req, res))
    .delete(verifyAdmin, async(req, res) => await deleteProduct(req, res))

router.route('/api/categories')
    .get(async(req, res) => await getProductCategories(req, res))
    .post(verifyAdmin, async(req, res) => await addProductCategory(req, res))
router.route('/api/categories/:categoryId')
    .get(verifyAdmin, async(req, res) => await getProductCategory(req, res))
    .put(verifyAdmin, async(req, res) => await updateProductCategory(req, res))
    .delete(verifyAdmin, async(req, res) => await deleteProductCategory(req, res))

router.route('/api/brands')
    .get(async(req, res) => await getProductBrands(req, res))
    .post(verifyAdmin, async(req, res) => await addProductBrand(req, res))
router.route('/api/brands/:brandId')
    .get(verifyAdmin, async(req, res) => await getProductBrand(req, res))
    .put(verifyAdmin, async(req, res) => await updateProductBrand(req, res))
    .delete(verifyAdmin, async(req, res) => await deleteProductBrand(req, res))

module.exports = router