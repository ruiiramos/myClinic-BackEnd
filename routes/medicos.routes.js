const express = require('express');
const medicosController = require("../controllers/medicos.controller");
const checkAuth = require("../middleware/check-auth");
const checkCurrent = require("../middleware/check-current");
const checkAdmin = require("../middleware/check-admin");

// express router
let router = express.Router();

router.route('/')
    .get(medicosController.findAll)
    .post(medicosController.create)

router.route('/:id')
    .get(medicosController.findOne)

router.route('/login')
    .post(medicosController.login)

module.exports = router;