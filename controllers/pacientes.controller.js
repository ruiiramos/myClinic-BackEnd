const db = require("../models/index.js")
const Paciente = db.paciente;

//"Op" necessary for LIKE operator
const { Op, ValidationError } = require('sequelize');

// Display list of all pacientes
exports.findAll = async (req, res) => {
    try {
        let pacientes = await Paciente.findAll() 
        
        // Send response with pagination and data
        res.status(200).json({ 
            success: true, 
            data: pacientes
        });
    }
    catch (err) {
        if (err instanceof ValidationError) {
            return res.status(400).json({ success: false, message: err.message || 'Erro de validação ao procurar as pacientes.', error: err.message });
        } else {
            res.status(500).json({
                success: false, msg: err.message || "Ocorreu um erro ao procurar os pacientes."
            })
        }
    }
};

exports.findOne = async (req, res) => {
    try {
        const id = req.params.id;
        const paciente = await Paciente.findByPk(id);

        if (paciente) {
            return res.status(200).json({
                success: true,
                data: paciente
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'Paciente não encontrado.'
            });
        }
    } catch (err) {
        if (err instanceof ValidationError) {
            return res.status(400).json({
                success: false,
                message: err.message || 'Erro de validação ao procurar o paciente.',
                error: err.errors
            });
        } else {
            return res.status(500).json({
                success: false,
                message: err.message || 'Ocorreu um erro ao procurar o paciente.',
                error: err.message
            });
        }
    }
};