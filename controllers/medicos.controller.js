const db = require("../models/index.js")
const Medico = db.medico;

//"Op" necessary for LIKE operator
const { Op, ValidationError } = require('sequelize');

// Display list of all medicos
exports.findAll = async (req, res) => {
    try {
        let medicos = await Medico.findAll() 
        
        // Send response with pagination and data
        res.status(200).json({ 
            success: true, 
            data: medicos
        });
    }
    catch (err) {
        if (err instanceof ValidationError) {
            return res.status(400).json({ success: false, message: err.message || 'Erro de validação ao procurar as medicos.', error: err.message });
        } else {
            res.status(500).json({
                success: false, msg: err.message || "Ocorreu um erro ao procurar os médicos."
            })
        }
    }
};

exports.findOne = async (req, res) => {
    try {
        const id = req.params.id;
        const medico = await Medico.findByPk(id);

        if (medico) {
            return res.status(200).json({
                success: true,
                data: medico
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'Médico não encontrada.'
            });
        }
    } catch (err) {
        if (err instanceof ValidationError) {
            return res.status(400).json({
                success: false,
                message: err.message || 'Erro de validação ao procurar o médico.',
                error: err.errors
            });
        } else {
            return res.status(500).json({
                success: false,
                message: err.message || 'Ocorreu um erro ao procurar o médico.',
                error: err.message
            });
        }
    }
};