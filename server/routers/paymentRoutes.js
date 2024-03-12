const express = require('express')
const router = express.Router()
const verifyJWT = require('../middleware/verifyJWT')
const { createCheckoutSession } = require('../controllers/paymentController')


router.post('/api/stripe/create-checkout-session', verifyJWT, async(req, res) => await createCheckoutSession(req, res))

module.exports = router