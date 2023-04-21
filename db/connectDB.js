const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const connectDB =  (uri) => {
    return mongoose.connect(uri);
}

module.exports = connectDB;