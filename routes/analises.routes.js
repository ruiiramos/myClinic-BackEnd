const express = require('express');
const analisesController = require("../controllers/analises.controller");

// express router
let router = express.Router();

router.route('/')
    .get(analisesController.findAll)

router.route('/:id')
    .get(analisesController.findOne)

module.exports = router;