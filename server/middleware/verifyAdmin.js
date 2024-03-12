const jwt = require('jsonwebtoken')


const verifyAdmin = async (req, res, next) => {
    // check access token in the request 
    const authHeader = req.headers.authorization || req.headers.authorization
    if(!authHeader) {
        // check if the headers not contains authorization, then return 401 
        return res.status(401).json({message: 'Unauthorized', ok: false})
    }
    if(!authHeader.startsWith('Bearer')) {
        // check if the headers not contains Bearer token in the authorization
        return res.status(401).json({message: 'Unauthorized', ok: false})
    }
    // split and get the token
    const accessToken = authHeader.split(' ')[1]

    jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if(err) {
                // if expired then return 403
                return res.status(403).json({ message: 'Forbidden', ok: false })
            }
            // if not an admin, then retuern 403 and custom message
            if(decoded.UserInfo.role !== 'admin') {
                return res.status(403).json({message: 'Forbidden. You are not an admin.', ok: false})
            }
            next()
        }
    )
}

module.exports = verifyAdmin