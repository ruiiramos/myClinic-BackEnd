const express = require('express');
const especialidadeController = require("../controllers/especialidade.controller");
const checkAuth = require("../middleware/check-auth");
const checkCurrent = require("../middleware/check-current");
const checkAdmin = require("../middleware/check-admin");

// express router
let router = express.Router();

router.route('/')
    .get(checkAuth, especialidadeController.findAll) // PUBLIC
    .post(checkAuth, checkAdmin, especialidadeController.create); // PROTECTED (admin only)

router.route('/:id')
    .get(checkAuth, especialidadeController.findOne) // PROTECTED (user only)
    .delete(checkAuth, checkAdmin, especialidadeController.deleteEspecialidade) // PROTECTED (admin only)

router.all('*', function (req, res) {
    res.status(400).json({ success: false, message: 'myClinic: what???'  });
})

module.exports = router;