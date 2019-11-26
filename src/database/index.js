const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/App' , {useNewUrlParser:true ,  useFindAndModify: false });
mongoose.Promise = global.Promise;

module.exports = mongoose;