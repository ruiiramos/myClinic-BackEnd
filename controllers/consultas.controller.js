const db = require("../models/index.js")
const Consulta = db.consulta;

//"Op" necessary for LIKE operator
const { Op, ValidationError } = require('sequelize');

// Display list of all consultas
exports.findAll = async (req, res) => {
    try {
        let consultas = await Consulta.findAll() 
        
        // Send response with pagination and data
        res.status(200).json({ 
            success: true, 
            data: consultas
        });
    }
    catch (err) {
        if (err instanceof ValidationError) {
            return res.status(400).json({ success: false, message: err.message || 'Erro de validação ao procurar as consultas.', error: err.message });
        } else {
            res.status(500).json({
                success: false, msg: err.message || "Ocorreu um erro ao procurar as consultas."
            })
        }
    }
};

exports.findOne = async (req, res) => {
    try {
        const id = req.params.id;
        const consulta = await Consulta.findByPk(id);

        if (consulta) {
            return res.status(200).json({
                success: true,
                data: consulta
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'Consulta não encontrada.'
            });
        }
    } catch (err) {
        if (err instanceof ValidationError) {
            return res.status(400).json({
                success: false,
                message: err.message || 'Erro de validação ao procurar a consulta.',
                error: err.errors
            });
        } else {
            return res.status(500).json({
                success: false,
                message: err.message || 'Ocorreu um erro ao procurar a consulta.',
                error: err.message
            });
        }
    }
};