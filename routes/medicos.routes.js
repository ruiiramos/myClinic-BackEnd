const express = require('express');
const medicosController = require("../controllers/medicos.controller");
const checkAuth = require("../middleware/check-auth");
const checkCurrent = require("../middleware/check-current");
const checkAdmin = require("../middleware/check-admin");

// express router
let router = express.Router();

router.route('/')
    .get(checkAuth, medicosController.findAll) // PROTECTED (user only)
    .post(medicosController.create) // PUBLIC

router.route('/:id')
    .get(checkAuth, medicosController.findOne) // PROTECTED (user only)
    .patch(checkAuth, medicosController.update) // PROTECTED (user only)

router.route('/login')
    .post(medicosController.login) // PUBLIC

router.all('*', function (req, res) {
    res.status(400).json({ success: false, message: 'myClinic: what???'  });
})

module.exports = router;