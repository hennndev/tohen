const jwt = require('jsonwebtoken')

const verifyAdmin = async (req, res, next) => {
    //Mengambil data token akses pada header request 
    const authHeader = req.headers.authorization || req.headers.authorization
    if(!authHeader) {
        //// Jika tidak ada auhotorization pada header, maka akan di return status 401
        return res.status(401).json({message: 'Unauthorized', ok: false})
    }
    if(!authHeader.startsWith('Bearer')) {
        // Jika tidak ada bearer token, maka akan di return status 401
        return res.status(401).json({message: 'Unauthorized', ok: false})
    }
    // mengambil token akses
    const accessToken = authHeader.split(' ')[1]

    //Kemudian verify token akses tersebut
    jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if(err) {
                // Cek jika token akses sudah kadaluarsa, maka akan direturn 403
                return res.status(403).json({ message: 'Forbidden', ok: false })
            }
            // Cek jika user role bukan admin, maka akan direturn 403, dengan message yang berbeda
            if(decoded.UserInfo.role !== 'admin') {
                return res.status(403).json({message: 'Forbidden. You are not an admin.', ok: false})
            }
            next()
        }
    )
}

module.exports = verifyAdmin