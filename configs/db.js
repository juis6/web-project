const mongoose = require('mongoose');

const connectDB = async (uri) => {
    try {
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(uri);
        console.log(`Database connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDB;