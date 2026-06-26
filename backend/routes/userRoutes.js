const express = require("express");
const authController = require("../controller/authController");

const router = express.Router();

router.post("/singUp", authController.singUp);
router.post("/login", authController.login);
router.get("/users", authController.getUserList);

module.exports = router;
