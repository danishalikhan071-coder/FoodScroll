// server start yaha se krenge

require('dotenv').config()
const app = require('./src/app')
const connectDB = require('./src/db/db')

connectDB();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.listen(3000, ()=>{
    console.log("server started")
})