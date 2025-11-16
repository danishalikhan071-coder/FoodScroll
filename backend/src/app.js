// server create yaha krenge

const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/auth.routes')
const foodRoutes = require('./routes/food.routes')
const foodPartnerRoutes = require('./routes/food-partner.routes')
const cors = require('cors')


app.use(cors({ // BE ko FE server se data sharing krne ke liye
    origin: (origin, callback) => {
        const allowedOrigins = [
            process.env.CLIENT_URL || "http://localhost:5173",
            "https://foodscroll.vercel.app",
            "http://localhost:5173"
        ];
        
        // Normalize origins (remove trailing slashes for comparison)
        const normalizeOrigin = (url) => url ? url.replace(/\/$/, '') : url;
        const normalizedOrigin = normalizeOrigin(origin);
        
        const isAllowed = allowedOrigins.some(allowed => 
            normalizeOrigin(allowed) === normalizedOrigin
        );
        
        if (isAllowed || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))

app.get('/', (req , res)=>{
    res.send("hello world")
})
app.use('/api/auth',authRoutes)
app.use('/api/food',foodRoutes)
app.use('/api/food-partner',foodPartnerRoutes)

module.exports = app;