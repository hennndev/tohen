const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const login = async (req, res) => {
    const { email, password } = req.body
    try {   
        const user = await User.findOne({email: email})
        if(user) {
            const checkPassword = await bcrypt.compare(password, user.password)
            if(checkPassword) {
                // After email and password correct, then doing below...
                // create access token after login
                const accessToken = jwt.sign(
                    {
                        UserInfo: {
                            userId: user._id,
                            role: user.role
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    {expiresIn: '60s'}
                )
                // create refresh token
                const refreshToken = jwt.sign(
                    {userId: user._id},
                    process.env.REFRESH_TOKEN_SECRET,
                    {expiresIn: '7d'}
                )

                // create secure cookie with refresh token on the server
                res.cookie('refresh_token', refreshToken, {
                    httpOnly: true, //accessible only on the server
                    secure: true, //
                    sameSite: 'None', //cross-site cookie
                    maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expire on 7 days
                })

                res.status(200).json({
                    message: 'Success login',
                    accessToken: accessToken,
                    ok: true
                })
            } else {
                throw new Error('❌ Password incorrect!')
            }
        } else {
            throw new Error('❌ This email not exist!')
        }
    } catch (error) {
        res.status(400).json({
            message: error.message,
            ok: false
        })
    }
}

const register = async (req, res) => {
    const { fullname, username, email, password } = req.body
    const checkExistUser = await User.findOne({email: email})
    try {
        if(!checkExistUser) {
            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(password, salt)
            await User.create({fullname, username, email, role: 'customer', password: hashPassword})
            res.status(201).json({
                message: 'Success create new account',
                ok: true
            })
        } else {
            throw new Error('❌ This email already used!')
        }
    } catch (error) {
        res.status(400).json({
            message: error.message,
            ok: false
        })
    }
}

const logout = async (req, res) => {
    const cookies = req.cookies
    if(!cookies.refresh_token) {
        return res.sendStatus(204)
    }
    res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    })
    res.json({message: 'Cookie cleared'})
}

const refresh = async (req, res) => {
    const cookies = req.cookies
    if(!cookies.refresh_token) {
        return res.json({
            message: 'Unauthorized', 
            ok: false
        })
    }
    // access cookie its stored in server before
    const refreshToken = cookies.refresh_token
    
    // if cookie is exist, then verified that cookie
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if(err) return res.status(403).json({message: 'Forbidden', ok: false})
            const user = await User.findOne({_id: decoded.userId})
            if(!user) return res.status(401).json({message: 'Unauthorized', ok: false})

            // create new access token again
            const accessToken = jwt.sign(
                {
                    UserInfo: {
                        userId: user._id,
                        role: user.role
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '60s'}
            )
            return res.json({accessToken})
        }
    )
}

module.exports = {
    login,
    register,
    refresh,
    logout
}