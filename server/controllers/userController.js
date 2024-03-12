const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: 'dyvxku1wk',
    api_key: '473747957291284',
    api_secret: 'acUg7epEOn0aFSl-57xk5FEut_I'
})


const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password -createdAt -updatedAt -__v').sort({createdAt: -1}).lean()
        res.status(200).json({
            message: 'Success get all users',
            data: users,
            ok: true
        })
    } catch (error) {
        res.status(400).json({
            message: error.message,
            ok: false
        })        
    }
}

const getUser = async (req, res) => {
    try {
        const user = await User.findOne({_id: req.params.userId}).select('-password -__v -updatedAt -createdAt').populate('wishlist').lean()
        res.status(200).json({
            message: 'Success get user',
            data: user,
            ok: true
        })
    } catch (error) {
        res.status(400).json({
            message: 'Failed get user',
            ok: false
        })
    }
}

const  getWishlist = async (req, res) => {
    try {
        const user = await User.findOne({_id: req.params.userId}).select('-password -__v -updatedAt -createdAt -username -email -orders_history -personal_information').populate('wishlist').lean()
        const wishlist = user?.wishlist
        res.status(200).json({
            message: 'Success get wishlist',
            data: wishlist,
            ok: true
        })
    } catch (error) {
        res.status(400).json({
            message: 'Failed get wishlist',
            ok: false
        })
    }
}

const handleWishlist = async (req, res) => {
    const checkExistItem = await User.findOne({_id: req.params.userId, wishlist: req.body.productId})
    try {
        if(req.params.method === 'add') {
            if(checkExistItem) {
                throw new Error('❌ Product already added in the wishlist')
            } else {
                await User.updateOne({_id: req.params.userId}, {
                    $push: {wishlist: req.body.productId}
                })
            }
        }
        if(req.params.method === 'delete') {
            await User.updateOne({_id: req.params.userId}, {
                $pull: {wishlist: req.body.productId}
            })
        }
        if(req.params.method === 'clear') {
            await User.updateOne({_id: req.params.userId}, {wishlist: []})
        }
        let message
        if(req.params.method === 'add') message = 'Product has added to the wishlist'
        if(req.params.method === 'delete') message = 'Product has deleted from the wishlist'
        if(req.params.method === 'clear') message = 'Wishlist cleared'
        res.status(201).json({
            message: message,
            ok: true
        })
    } catch (error) {
        res.status(400).json({
            message: error.message,
            ok: false
        })
    }
}

const changePhoto = async (req, res) => {
    const { oldPhotoId, photoUrl, photoId } = req.body
    try {
        if(oldPhotoId && oldPhotoId !== null) {
            await cloudinary.uploader.destroy(oldPhotoId)
        }
        await User.updateOne({_id: req.params.userId}, {
            photo: {
                photo_id: photoId,
                photo_url: photoUrl
            }
        })
        res.status(200).json({
            message: 'Your new photo profile has been set',
            ok: true
        })
    } catch (error) {
        res.status(400).json({
            message: '❌ Failed set new photo profile',
            ok: false
        })
    }
}

const updateUser = async (req, res) => {
    try {
        await User.updateOne({_id: req.params.userId}, {...req.body})
        res.status(200).json({
            message: 'Your new profile data has updated now'
        })
    } catch (error) {
        res.status(400).json({
            message: '❌ Failed update new profile data'
        })
    }
}

const deleteUser = async (req, res) => {
    const checkExistUser = await User.findOne({_id: req.params.userId})
    try {
        if(checkExistUser.username === req.body.isUsername) {
            await User.deleteOne({_id: req.params.userId})
            if(checkExistUser.photo.photo_id) {
                await cloudinary.uploader.destroy(checkExistUser.photo.photo_id)
            }
            res.status(200).json({
                message: 'This account has deleted',
                ok: true
            })
        } else {
            throw new Error('❌ Username not match!')
        }
    } catch (error) {
        res.status(400).json({
            message: error.message
        })        
    }
}

const changePassword = async (req, res) => {
    const user = await User.findOne({_id: req.params.userId})
    try {
        const checkPassword = await bcrypt.compare(req.body.password, user.password)
        if(checkPassword) {
            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(req.body.newPassword, salt)
            await User.updateOne({_id: req.params.userId}, {
                password: hashPassword
            })
            res.status(200).json({
                message: 'New password has updated',
                ok: true
            })
        } else {
            throw new Error('❌ Wrong password!')
        }
    } catch (error) {
        res.status(400).json({
            message: error.message,
            ok: false
        })
    }
}

const getOrdersHistory = async (req, res) => {
    const { userId } = req.params
    try {
        const user = await User.findOne({_id: userId}).select('-password -__v -updatedAt -createdAt -username -email -wishlist -personal_information').populate('orders_history').lean()
        const orders_history = user?.orders_history
        res.status(200).json({
            message: 'Success get orders history',
            orders: orders_history,
            ok: true
        })        
    } catch (error) {
        res.status(400).json({
            message: 'Failed get orders history',
            ok: false
        })        
    }
}


module.exports = {
    getUsers,
    getUser,
    getWishlist,
    handleWishlist,
    changePhoto,
    updateUser,
    deleteUser,
    changePassword,
    getOrdersHistory
}