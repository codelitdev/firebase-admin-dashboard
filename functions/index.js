// Hosts the Express based API on a Firebase cloud function.

const functions = require("firebase-functions");

exports.api = functions.https.onRequest(require("./api.js"));
