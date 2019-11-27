const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json()); //entende q vou envar em JSON
app.use(bodyParser.urlencoded({ extended: false })); //entende que vou passar parametros via url

require("./app/controllers/index.js")(app);

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("App is listening port : ", PORT);
}); //porta);
