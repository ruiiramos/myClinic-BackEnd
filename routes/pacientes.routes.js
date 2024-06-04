const express = require('express');
const pacientesController = require("../controllers/pacientes.controller");
const checkAuth = require("../middleware/check-auth");
const checkCurrent = require("../middleware/check-current");
const checkAdmin = require("../middleware/check-admin");

// express router
let router = express.Router();

router.route('/')
    .get(checkAuth, pacientesController.findAll) // PROTECTED (user only)
    .post(pacientesController.create) // PUBLIC

router.route('/:id')
    .get(checkAuth, pacientesController.findOne) // PROTECTED (user only)
    .patch(checkAuth, pacientesController.update) // PROTECTED (user only)
    .delete(checkAuth, pacientesController.delete) // PROTECTED (user only)

router.route('/login')
    .post(pacientesController.login) // PUBLIC

router.all('*', function (req, res) {
    res.status(400).json({ success: false, message: 'myClinic: what???'  });
})

module.exports = router;