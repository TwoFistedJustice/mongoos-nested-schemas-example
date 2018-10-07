const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/CoffeeApp', { useNewUrlParser: true });
module.exports = {mongoose};