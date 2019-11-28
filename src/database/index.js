const mongoose = require("mongoose");

mongoose.connect(
  //"mongodb://localhost:27017/Hackathon_Rocketseat"
  "mongo",
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
  }
);
mongoose.Promise = global.Promise;

module.exports = mongoose;
