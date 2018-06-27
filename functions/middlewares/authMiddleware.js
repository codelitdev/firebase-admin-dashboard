// A basic middleware function to verify json web tokens.

const functions = require("firebase-functions");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const jwt_secret = functions.config().auth.secret;
  const token = req.body.token;

  if (!token)
    return res.status(401).send({ auth: false, message: "No token provided" });

  return jwt.verify(token, jwt_secret, err => {
    if (err) return res.status(200).send({ message: "There was a problem" });

    return next();
  });
};
