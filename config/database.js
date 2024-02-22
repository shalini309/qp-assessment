const mongoose = require('mongoose');
require('dotenv').config();
let uri;
module.exports = () => {
    uri = process.env.DB_URL;
    mongoose.connect(uri, {})
        .then(result => console.log('Database connected successfully ===', uri))
        .catch(err => console.log(err));
}