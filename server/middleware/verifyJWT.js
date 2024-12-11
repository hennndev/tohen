const jwt = require('jsonwebtoken')

//Middleware untuk verifikasi user login apakah ada token akses atau tidak, dan token tidak kadaluarsa
const verifyJWT = async (req, res, next) => {
    //Mengambil data token akses pada header request
    const authHeader = req.headers.authorization || req.headers.Authorization
    if(!authHeader?.startsWith('Bearer')) {
        // Cek jika tidak ada bearer token, maka akan di return status 401
        return res.status(401).json({message: 'Unauthorized', ok: false})
    }
    // mengambil token akses
    const accessToken = authHeader.split(' ')[1]

    //kemudian verify token akses tersebut
    jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if(err) {
                // Cek jika token sudah kadaluarsa, akan di return 403
                return res.status(403).json({message: 'Forbidden', ok: false})
            }
            //Jika tidak, maka user akan menyimpan data userId dan user role
            req.userId = decoded.UserInfo.userId
            req.role = decoded.UserInfo.role
            next()
        }
    )
} 

module.exports = verifyJWT