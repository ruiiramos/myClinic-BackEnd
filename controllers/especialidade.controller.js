const db = require("../models/index.js");
const especialidade = db.especialidade;

//"Op" necessary for LIKE operator
const { Op, ValidationError } = require('sequelize');

// Display list of all tutorials (with pagination)
exports.findAll = async (req, res) => {
    try {
        let especialidades = await especialidade.findAll() 
        
        // Send response with pagination and data
        res.status(200).json({ 
            success: true, 
            data: especialidades
        });
    }
    catch (err) {
        if (err instanceof ValidationError) {
            return res.status(400).json({ success: false, message: err.message || 'Erro de validação ao procurar as especialidades.', error: err.message });
        } else {
            res.status(500).json({
                success: false, msg: err.message || "Some error occurred while retrieving the tutorials."
            })
        }
    }
};

exports.findOne = async (req, res) => {
    try {
        const id = req.params.id;
        const especialidadeData = await especialidade.findByPk(id);

        if (especialidadeData) {
            return res.status(200).json({
                success: true,
                data: especialidadeData
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'Especialidade não encontrada.'
            });
        }
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(400).json({
                success: false,
                message: error.message || 'Erro de validação ao procurar a especialidade.',
                error: error.errors
            });
        } else {
            return res.status(500).json({
                success: false,
                message: error.message || 'Ocorreu um erro ao procurar a especialidade.',
                error: error.message
            });
        }
    }
};