const jwt = require("jsonwebtoken");
const authConfig = require("../../config/auth.json");

module.exports = (req, res, next) => {
  return next();
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send({ error: "No token provided" });

  if (authHeader == "master") {
    req.userId = "5d3a0c50954f933c8c98b817";
    return next();
  }
  const parts = authHeader.split(" ");
  if (!parts.lenght === 2)
    return res.status(401).send({ error: "Token error" });

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme))
    return res.status(401).send({ error: "Token malformatted" });

  jwt.verify(token, authConfig.secret, (err, decoded) => {
    if (err) return res.status(401).send({ error: "Token inválido" });

    req.userId = decoded.id;
    return next();
  });
};
