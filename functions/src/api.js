// The entry point for the Express based API.

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const login = require("./routes/login.js");
const admin = require("./routes/admin.js");
const functions = require("firebase-functions");

// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const app = express();

// Automatically allow cross-origin requests (as suggested by firebase docs)
app.use(cors({ origin: true }));

// parse body as json
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

app.use("/login", login);
app.use("/admin", admin);

// module.exports = app;
exports.api = functions.https.onRequest(app);