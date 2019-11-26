const express = require("express");
const jwt = require("jsonwebtoken"); //gera token
const authMiddleware = require("../middlewares/auth");
const authConfig = require("../../config/auth");
const User = require("../models/User");
const router = express.Router();

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400
  });
}

router.use(authMiddleware);
router.post("/register", async (req, res) => {
  const { email } = req.body;
  try {
    if (await User.findOne({ email }))
      return res.status(409).send({ error: "User already exists" });
    req.body.id_user_last_edit = req.userId;
    const user = await User.create(req.body);

    user.password = undefined;

    return res.send({
      user,
      token: generateToken({ id: user.id })
    });
  } catch (err) {
    return res.status(400).send({ error: "Registration failed" });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    return res.send({ users });
  } catch (err) {
    return res.status(500).send({ error: "Error get all users" });
  }
});

router.get("/", async (req, res) => {
  try {
    var userId = req.query.userId;
    const user = await User.findById(userId).populate(["id_user_last_edit"]);

    if (user === null) return res.status(404).send({ error: "User not found" });

    return res.send({ user });
  } catch (err) {
    return res.status(500).send({ error: "Error get user" });
  }
});

module.exports = app => app.use("/user", router);
