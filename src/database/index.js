const mongoose = require("mongoose");

mongoose.connect(
  //"mongodb://localhost:27017/Hackathon_Rocketseat"
  "mongodb+srv://Brenner:yjsSt9Le1eCvHgxP@cluster0-kdimj.mongodb.net/hackathon_devnaescola?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
  }
);
mongoose.Promise = global.Promise;

module.exports = mongoose;
