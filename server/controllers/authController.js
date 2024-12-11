const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

// LOGIN
const login = async (req, res) => {
    const { email, password } = req.body
    try {   
        const user = await User.findOne({email: email})
        //Cek apakah user tersebut pernah di registrasikan atau belum
        if(user) {
            const checkPassword = await bcrypt.compare(password, user.password)
            //Jika ada, kemudian cek password
            if(checkPassword) {
                // Kemudian, membuat token akses dengan kriteria berdasarkan user id dan role
                const accessToken = jwt.sign(
                    {
                        UserInfo: {
                            userId: user._id,
                            role: user.role
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET, //merupakan jwt secret dalam pembuatan token
                    {expiresIn: '60s'} //token akses expired selama 1 menit
                )
                // Setelah itu, membuat token refresh dengan expired selama 7 hari
                const refreshToken = jwt.sign(
                    {userId: user._id},
                    process.env.REFRESH_TOKEN_SECRET,
                    {expiresIn: '7d'}
                )

                // Lalu membuat secure cookie dengan token refresh
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

//MELAKUKAN REGISTRASI USER AKUN BARU
const register = async (req, res) => {
    const { fullname, username, email, password } = req.body
    const checkExistUser = await User.findOne({email: email})
    try {
        //Cek apakah user email tersebut sudah pernah di registrasikan atau belum
        if(!checkExistUser) {
            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(password, salt)
            //Jika belum, maka akan membuat user baru
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

//MELAKUKAN LOGOUT
const logout = async (req, res) => {
    //Mengambil data cookie
    const cookies = req.cookies
    //Jika tidak ada cookie dengan nama refresh_token, kembalikan status 204
    if(!cookies.refresh_token) {
        return res.sendStatus(204)
    }
    //Lalu clear cookie refresh_token, hingga cookie sudah benar benar dihapus
    //Sehingga token refresh juga ikut terhapus
    res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    })
    res.json({message: 'Cookie cleared'})
}

//MELAKUKAN REFRESH
const refresh = async (req, res) => {
    const cookies = req.cookies
    if(!cookies.refresh_token) {
        //Jika token refresh tidak ada, maka akan return user not logged in
        return res.json({
            message: 'Unauthorized', 
            ok: false
        })
    }
    // akses token refresh yang sudah dibuat dan disimpan sebelumnya saat login
    const refreshToken = cookies.refresh_token
    
    // Kemudian melakukan verifikasi terhadap token refresh
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            //Jika expired maka return forbidden 403
            if(err) return res.status(403).json({message: 'Forbidden', ok: false})
            const user = await User.findOne({_id: decoded.userId})
            //Jika user tidak ada, akan return unauthorized 401 
            if(!user) return res.status(401).json({message: 'Unauthorized', ok: false})

            // kemudian membuat token akses kembali dengan jwt secret dan durasi waktu yang sama
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
            //Kirim token akses sebagai response
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