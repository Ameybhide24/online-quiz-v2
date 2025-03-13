const mongoose = require('mongoose');

const connectDB = async (connectionString) => {
    try {
        await mongoose.connect(connectionString);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

module.exports = connectDB;