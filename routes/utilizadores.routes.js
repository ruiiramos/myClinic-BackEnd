const express = require('express');
const utilizadoresController = require("../controllers/utilizadores.controller");
const checkAuth = require("../middleware/check-auth");
const checkCurrent = require("../middleware/check-current");
const checkAdmin = require("../middleware/check-admin");

// express router
let router = express.Router();

router.route('/medicos')
    .get(checkAuth, utilizadoresController.findAllMedicos) // PROTECTED (user only)
    .post(checkAuth, checkAdmin, utilizadoresController.createMedico) // PROTECTED (admin only)

router.route('/pacientes')
    .get(checkAuth, utilizadoresController.findAllPacientes) // PROTECTED (user only)
    .post(utilizadoresController.createPaciente) // PUBLIC

router.route('/medicos/:id')
    .get(checkAuth, utilizadoresController.findOneMedico) // PROTECTED (user only)
    .patch(checkAuth, checkAdmin, utilizadoresController.updateMedicos) // PROTECTED (admin only)
    .delete(checkAuth, checkAdmin, utilizadoresController.deleteMedicos) // PROTECTED (admin only)

router.route('/medicos/especialidade/:id')
    .get(checkAuth, utilizadoresController.findMedicosByEspecialidade) // PROTECTED (user only)

router.route('/pacientes/:id')
    .get(checkAuth, utilizadoresController.findOneMedico) // PROTECTED (user only)
    .patch(checkAuth, utilizadoresController.updatePacientes) // PROTECTED (user only)
    .delete(checkAuth, utilizadoresController.deletePacientes) // PROTECTED (user only)

router.route('/login/medicos')
    .post(utilizadoresController.loginMedicos) // PUBLIC

router.route('/login/pacientes')
    .post(utilizadoresController.loginPacientes) // PUBLIC

router.route('/verify-email')
    .post(utilizadoresController.verifyEmail) // PUBLIC

router.route('/resend-email') 
    .post(utilizadoresController.resendEmail) // PUBLIC
    
router.route('/forgot-password') 
    .post(utilizadoresController.forgotPassword) // PUBLIC

router.route('/reset-password/:token')
    .patch(utilizadoresController.resetPassword) // PUBLIC

router.all('*', function (req, res) {
    res.status(400).json({ success: false, message: 'myClinic: what???'  });
})

module.exports = router;