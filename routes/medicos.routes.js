const express = require('express');
const medicosController = require("../controllers/medicos.controller");

// express router
let router = express.Router();

router.route('/')
    .get(medicosController.findAll)

router.route('/:id')
    .get(medicosController.findOne)

module.exports = router;