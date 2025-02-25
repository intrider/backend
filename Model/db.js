const mongoose = require('mongoose');
require('dotenv').config();
const uri = process.env.MONGO_URL;

const connect = async () => {
    try {
        await mongoose.connect(uri);
        console.log('Connected to database');
    } catch (err) {
        console.error('Database connection failed:', err);
    }
};

module.exports = { connect };
