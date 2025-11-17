// server create yaha krenge

const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/auth.routes')
const foodRoutes = require('./routes/food.routes')
const foodPartnerRoutes = require('./routes/food-partner.routes')
const cors = require('cors')


const allowedOrigins = [
  process.env.CLIENT_URL, 
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173"
].map(o => o?.replace(/\/$/, '')).filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // mobile/postman/etc allowed

    const normalizedOrigin = origin.replace(/\/$/, '').toLowerCase();

    if (allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.options("*", cors()); // <-- MOST IMPORTANT

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