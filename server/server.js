const express = require('express')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env') })
const colors = require('colors')
const connectDB = require('./config/dbconfig')
const errorHandler = require('./middleware/errorHandler')
const cors = require('cors')

const PORT = process.env.PORT || 8080
const app = express()

connectDB()

app.use(cors({
  origin: [
    "http://localhost:5173",
    process.env.CLIENT_URL
  ].filter(Boolean),
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
  res.json({ msg: "WELCOME TO EduVerse API 1.0" })
})

app.use(require("./routes/githubAuth"))
app.use(require("./routes/googleAuth"))

app.use("/api/auth", require("./routes/authRoutes"))
app.use('/api/product', require("./routes/productRoutes"))
app.use('/api/message', require("./routes/messageRoute"))
app.use('/api/event', require("./routes/eventRoutes"))
app.use('/api/admin', require("./routes/adminRoutes"))

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING AT PORT : ${PORT}`.bgYellow.white)
})