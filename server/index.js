const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const corsOptions = require('./config/corsOptions')
const app = express()
require('dotenv').config()
// routes
const authRoute = require('./routers/authRoute')
const userRoute = require('./routers/userRoute')
const productRoute = require('./routers/productRoute')
const paymentRoute = require('./routers/paymentRoutes')


app.use(express.json())
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'client/dist')));
mongoose.set('strictQuery', 'false')
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        app.listen(process.env.PORT || 3000, () => console.log('Server and database connected'))
    })
    .catch((error) => {
        console.log(error)
        console.log('Server and database failed connected')
    })
app.use(productRoute)
app.use(authRoute)
app.use(userRoute)
app.use(paymentRoute)
