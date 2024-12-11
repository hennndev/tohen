const express = require('express')
const router = express.Router()
const verifyJWT = require('../middleware/verifyJWT')
const verifyAdmin = require('../middleware/verifyAdmin')
const { getUsers, getUserDetails, getUserInfo, handleWishlist, getWishlist, deleteUser, changePassword, updateUser, changePhoto, getOrdersHistory } = require('../controllers/userController')

router.get('/api/users', verifyAdmin, async (req, res) => await getUsers(req, res))
router.get('/api/users/:userId', verifyJWT, async (req, res) => await getUserDetails(req, res))
router.get('/api/users/:userId/user-info', verifyJWT, async (req, res) => await getUserInfo(req, res))
router.get('/api/users/:userId/wishlist', verifyJWT, async (req, res) => await getWishlist(req, res))
router.get('/api/users/:userId/orders-history', verifyJWT, async (req, res) => await getOrdersHistory(req, res))

router.patch('/api/users/:userId/change-photo', verifyJWT, async (req, res) => await changePhoto(req, res))
router.patch('/api/users/:userId/wishlist/:method', verifyJWT, async (req, res) => await handleWishlist(req, res))
router.patch('/api/users/:userId/change-password', verifyJWT, async (req, res) => await changePassword(req, res))

router.put('/api/users/:userId', verifyJWT, async (req, res) => await updateUser(req, res))

router.delete('/api/users/:userId', verifyJWT, async (req, res) => await deleteUser(req, res))

module.exports = router