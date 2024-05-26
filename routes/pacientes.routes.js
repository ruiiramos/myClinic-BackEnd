const express = require('express');
const pacientesController = require("../controllers/pacientes.controller");
const checkAuth = require("../middleware/check-auth");
const checkCurrent = require("../middleware/check-current");
const checkAdmin = require("../middleware/check-admin");

// express router
let router = express.Router();

router.route('/')
    .get(pacientesController.findAll)
    .post(pacientesController.create)

router.route('/:id')
    .get(pacientesController.findOne)

router.route('/login')
    .post(pacientesController.login)

module.exports = router;