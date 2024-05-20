const express = require('express');
const examesController = require("../controllers/exames.controller");

// express router
let router = express.Router();

router.route('/')
    .get(examesController.findAll)

router.route('/:id')
    .get(examesController.findOne)

module.exports = router;