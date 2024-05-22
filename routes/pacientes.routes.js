const express = require('express');
const pacientesController = require("../controllers/pacientes.controller");

// express router
let router = express.Router();

router.route('/')
    .get(pacientesController.findAll)

router.route('/:id')
    .get(pacientesController.findOne)

router.route('/signup')
    .post(pacientesController.create)

module.exports = router;