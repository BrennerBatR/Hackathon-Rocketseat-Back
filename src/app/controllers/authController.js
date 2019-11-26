const express = require("express");
const bcrypt = require("bcryptjs"); //encrypta senha
const jwt = require("jsonwebtoken"); //gera token
const crypto = require("crypto");
const mailer = require("../../modules/mailer");
const authMiddleware = require("../middlewares/auth");

const authConfig = require("../../config/auth");

const User = require("../models/User");

const router = express.Router();

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400
  });
}

router.post("/authenticate", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) return res.status(404).send({ error: "User not found" });

  if (!(await bcrypt.compare(password, user.password)))
    return res.status(403).send({ error: "Invalid Password" });

  user.password = undefined;

  res.send({
    user,
    token: generateToken({ id: user.id })
  });
});

module.exports = app => app.use("/auth", router);
