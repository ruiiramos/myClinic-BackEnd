const express = require('express');
const analisesController = require("../controllers/analises.controller");
const checkAuth = require("../middleware/check-auth");
const checkCurrent = require("../middleware/check-current");
const checkAdmin = require("../middleware/check-admin");

// express router
let router = express.Router();

router.route('/')
    .get(checkAuth, analisesController.findAll) // PROTECTED (user only)
    .post(checkAuth, checkCurrent, analisesController.create); // PROTECTED (doctor only)

router.route('/:id')
    .get(checkAuth, analisesController.findOne) // PROTECTED (user only)

router.all('*', (req, res) => {
    res.status(404).json({ success: false, message: 'myClinic: what???' }); 
})

module.exports = router;