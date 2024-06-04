const express = require('express');
const examesController = require("../controllers/exames.controller");
const checkAuth = require("../middleware/check-auth");
const checkCurrent = require("../middleware/check-current");
const checkAdmin = require("../middleware/check-admin");

// express router
let router = express.Router();

router.route('/')
    .get(checkAuth, examesController.findAll) // PROTECTED (user only)
    .post(checkAuth, checkCurrent, examesController.create) // PROTECTED (doctor only)

router.route('/:id')
    .get(checkAuth, examesController.findOne) // PROTECTED (user only)

router.all('*', function (req, res) {
    res.status(400).json({ success: false, message: 'myClinic: what???'  });
})
module.exports = router;