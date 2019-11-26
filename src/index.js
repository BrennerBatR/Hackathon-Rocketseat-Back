const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json()); //entende q vou envar em JSON
app.use(bodyParser.urlencoded({ extended: false })); //entende que vou passar parametros via url

require("./app/controllers/index.js")(app);

app.listen(3000, () => {
  console.log("App is listening on port : 3000");
}); //porta
