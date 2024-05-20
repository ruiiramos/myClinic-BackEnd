const db = require("../models/index.js")
const Analise = db.analise;

//"Op" necessary for LIKE operator
const { Op, ValidationError } = require('sequelize');

// Display list of all analises
exports.findAll = async (req, res) => {
    try {
        let analises = await Analise.findAll() 
        
        // Send response with pagination and data
        res.status(200).json({ 
            success: true, 
            data: analises
        });
    }
    catch (err) {
        if (err instanceof ValidationError) {
            return res.status(400).json({ success: false, message: err.message || 'Erro de validação ao procurar as analises.', error: err.message });
        } else {
            res.status(500).json({
                success: false, msg: err.message || "Ocorreu um erro ao procurar as análises."
            })
        }
    }
};

exports.findOne = async (req, res) => {
    try {
        const id = req.params.id;
        const analise = await Analise.findByPk(id);

        if (analise) {
            return res.status(200).json({
                success: true,
                data: analise
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'Análise não encontrada.'
            });
        }
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(400).json({
                success: false,
                message: error.message || 'Erro de validação ao procurar a análise.',
                error: error.errors
            });
        } else {
            return res.status(500).json({
                success: false,
                message: error.message || 'Ocorreu um erro ao procurar a análise.',
                error: error.message
            });
        }
    }
};