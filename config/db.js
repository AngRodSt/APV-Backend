import mongoose from "mongoose";

const conectDB = async () => {

    try {
        const db = await mongoose.connect(process.env.MONGO_URI)
        
        const url = `${db.connection.host}:${db.connection.port}`
        console.log(`MongoDB conectando en: ${url} `)

    } catch (error) {
        console.log(`error: ${error.messege}`)
        process.exit(1)
    }

}

export default conectDB;