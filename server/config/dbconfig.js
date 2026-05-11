const mongoose = require ("mongoose")

const connectDB = async()=>{
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing. Add it to server/.env or your Render environment variables.")
        }

        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`DB CONNECTION SUCESS : ${conn.connection.name}`.bgGreen.white)
    } catch (error) {
        console.log(`DB CONNECTION FAILED :${error.message}`.bgRed)
        process.exit(1)
    }
}


module.exports = connectDB
