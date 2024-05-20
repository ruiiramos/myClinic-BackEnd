const express = require('express');
const consultasController = require("../controllers/consultas.controller");

// express router
let router = express.Router();

router.route('/')
    .get(consultasController.findAll)

router.route('/:id')
    .get(consultasController.findOne)

module.exports = router;