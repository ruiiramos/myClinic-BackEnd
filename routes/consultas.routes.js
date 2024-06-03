const express = require('express');
const consultasController = require("../controllers/consultas.controller");
const checkAuth = require("../middleware/check-auth");
const checkCurrent = require("../middleware/check-current");
const checkAdmin = require("../middleware/check-admin");

// express router
let router = express.Router();

router.route('/')
    .get(checkAuth, consultasController.findAll) // PROTECTED (user only)

router.route('/:id')
    .get(checkAuth, consultasController.findOne) // PROTECTED (user only)

router.route('/paciente/:id')
    .get(checkAuth, consultasController.findByPaciente) // PROTECTED (user only)

router.all('*', (req, res) => {
    res.status(404).json({ success: false, message: 'myClinic: what???' }); 
})

module.exports = router;