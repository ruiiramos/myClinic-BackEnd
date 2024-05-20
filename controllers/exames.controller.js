const db = require("../models/index.js")
const Exame = db.exame;

//"Op" necessary for LIKE operator
const { Op, ValidationError } = require('sequelize');

// Display list of all exames
exports.findAll = async (req, res) => {
    try {
        let exames = await Exame.findAll() 
        
        // Send response with pagination and data
        res.status(200).json({ 
            success: true, 
            data: exames
        });
    }
    catch (err) {
        if (err instanceof ValidationError) {
            return res.status(400).json({ success: false, message: err.message || 'Erro de validação ao procurar os exames.', error: err.message });
        } else {
            res.status(500).json({
                success: false, msg: err.message || "Ocorreu um erro ao procurar os exames."
            })
        }
    }
};

exports.findOne = async (req, res) => {
    try {
        const id = req.params.id;
        const exame = await Exame.findByPk(id);

        if (exame) {
            return res.status(200).json({
                success: true,
                data: exame
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'Exame não encontrado.'
            });
        }
    } catch (err) {
        if (err instanceof ValidationError) {
            return res.status(400).json({
                success: false,
                message: err.message || 'Erro de validação ao procurar o exame.',
                error: err.errors
            });
        } else {
            return res.status(500).json({
                success: false,
                message: err.message || 'Ocorreu um erro ao procurar o exame.',
                error: err.message
            });
        }
    }
};