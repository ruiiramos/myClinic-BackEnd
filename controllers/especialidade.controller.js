const db = require("../models/index.js");
const Especialidade = db.especialidade;
const Medico = db.medico;

//"Op" necessary for LIKE operator
const { Op, ValidationError } = require('sequelize');

// Display list of all tutorials (with pagination)
exports.findAll = async (req, res) => {
    try {
        let especialidades = await Especialidade.findAll() 
        
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
        const especialidadeData = await Especialidade.findByPk(id);

        if (especialidadeData) {
            return res.status(200).json({
                success: true,
                data: especialidadeData
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'especialidade não encontrada.'
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

exports.create = async (req, res) => {
    try {
        const { especialidade } = req.body;
    
        if (!especialidade) {
            return res.status(400).json({
                message: "O campo especialidade é obrigatório"
            });
        }
    
        const existingEspecialidade = await Especialidade.findOne({ where: { especialidade: especialidade } });
    
        if (existingEspecialidade) {
            return res.status(400).json({
                message: "Especialidade já existe"
            });
        } else {
            const newEspecialidade = {
                especialidade: especialidade
            };
    
            Especialidade.create(newEspecialidade)
            .then(result => {
                res.status(201).json({
                    success: true,
                    message: "Especialidade criada com sucesso",
                    data: result
                });
            })
            .catch(err => {
                res.status(500).json({
                    success: false,
                    message: err.message || "Erro ao criar a especialidade"
                });
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Erro ao criar a especialidade"
        });   
    }
};