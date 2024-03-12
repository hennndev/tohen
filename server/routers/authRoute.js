const express = require('express')
const router = express.Router()
const { login, register, refresh, logout } = require('../controllers/authController')

router.get('/api/auth/refresh', async (req, res) => await refresh(req, res))
router.post('/api/auth/login', async (req, res) => await login(req, res))
router.post('/api/auth/register', async (req, res) => await register(req, res))
router.post('/api/auth/logout', async (req, res) => await logout(req, res))

module.exports = router