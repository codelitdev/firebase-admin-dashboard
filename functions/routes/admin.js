// Admin API end-points for your dashboard front-end.
// ============================================================
//
// Create your API end-points here.

const express = require("express");
const admin = require("firebase-admin");
const authMiddleware = require("../middlewares/authMiddleware.js");

const router = express.Router();
admin.initializeApp();

// this will restrict the access of admin routes to only authenticated clients
router.use(authMiddleware);

router.get("/", (req, res) =>
  res.status(200).send({
    message: "Welcome to the dashboard"
  })
);

router.post("/", (req, res) => {
  return res.status(200).send({
    message: "Welcome to the dashboard via POST"
  });
});

module.exports = router;
