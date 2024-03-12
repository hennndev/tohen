const jwt = require('jsonwebtoken')

const verifyJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization
    if(!authHeader?.startsWith('Bearer')) {
        // if headers not contains Bearer token, then will return 401
        return res.status(401).json({message: 'Unauthorized', ok: false})
    }
    // split and get the token
    const accessToken = authHeader.split(' ')[1]

    jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if(err) {
                // if expired, then return 403
                return res.status(403).json({message: 'Forbidden', ok: false})
            }
            req.userId = decoded.UserInfo.userId
            req.role = decoded.UserInfo.role
            next()
        }
    )
} 

module.exports = verifyJWT