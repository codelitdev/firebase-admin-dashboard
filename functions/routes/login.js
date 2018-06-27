// This router provides login related functionality to the app.
// ============================================================
//
// Edit this file to customize your authentication flow.

const express = require("express");
const router = express.Router();
const functions = require("firebase-functions");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get("/", (req, res) => {
  return res.status(200).send({ message: "Not allowed" });
});

// This method accepts username and passwords and returns a valid JWT if the
// user credential matches to one set in Firebase environment.
//
// Note: The users who can authenticate using the following method are the ones
// which are exported into the Firebase environment using `firebase config:set`
router.post("/", (req, res) => {
  // Check if 'user' and 'password' fields are present in the request
  if (!req.body.user) {
    return res.status(200).send({ message: "Bad request" });
  }
  if (!req.body.password) {
    return res.status(200).send({ message: "Bad request" });
  }

  const user = req.body.user;
  const pass = functions.config().users[req.body.user]; // generated from bcrypt.hashSync(plaintextpassword, 8)
  const jwt_secret = functions.config().auth.secret;

  // If password is not found for the provided user, it means it is not a valid
  // admin user hence return an error
  if (!pass) {
    return res.status(200).send({ message: "No such user" });
  }

  // if (user !== req.body.user)
  //   return res.status(200).send({ message: "Username or password incorrect" });
  // if (!req.body.password)
  //   return res.status(200).send({ message: "Password missing" });

  const passValid = bcrypt.compareSync(req.body.password, pass);
  if (!passValid)
    return res.status(200).send({
      auth: false,
      message: "Username or password incorrect"
    });

  const token = jwt.sign({ id: user }, jwt_secret, {
    expiresIn: 86400 // expires in 24 hours
  });

  return res.status(200).send({
    auth: true,
    token: token
  });
});

module.exports = router;
