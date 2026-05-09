const express = require('express')
require('dotenv').config()
const colors = require('colors')
const connectDB = require('./config/dbconfig')
const errorHandler = require('./middleware/errorHandler')
const cors = require('cors')  // ✅ Yeh line add karo!

const PORT = process.env.PORT || 5000
const app = express()
 
// DB CONNECTION
connectDB()

app.use(cors({
  origin: "http://localhost:5174",
  credentials: true
}))
// body Parser
app.use(express.json())
app.use(express.urlencoded())

// Home Route 
 app.get("/" , (req, res)=>{
    res.json({
        msg : "WELCOME TO EdUVERSE API 1.0"
    })
 })



//  ----------------------------------------------------------------

// AUTH Routes
app.use("/api/auth" , require("./routes/authRoutes"))


// Listing Product
app.use('/api/product', require("./routes/productRoutes"))

// Message Routes
app.use('/api/message', require("./routes/messageRoute"))

// Event Router
app.use('/api/event' , require("./routes/eventRoutes"))

// Admin Routes
app.use('/api/admin', require("./routes/adminRoutes"))


// error Handler
app.use(errorHandler)


 app.listen(PORT, ()=>{
    console.log(`SERVER IS RUNNING AT PORT : ${PORT}`.bgYellow.white  )
 })
 