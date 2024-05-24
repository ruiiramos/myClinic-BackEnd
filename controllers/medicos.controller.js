const db = require("../models/index.js")
const medico = db.medico;

//"Op" necessary for LIKE operator
const { Op, ValidationError } = require('sequelize');
const bcrypt = require('bcrypt');

// Display list of all medicos
exports.findAll = async (req, res) => {
    try {
        let medicos = await medico.findAll() 
        
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
        const medicoData = await medico.findByPk(id);

        if (medicoData) {
            return res.status(200).json({
                success: true,
                data: medicoData
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'medico não encontrada.'
            });
        }
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(400).json({
                success: false,
                message: error.message || 'Erro de validação ao procurar a medico.',
                error: error.errors
            });
        } else {
            return res.status(500).json({
                success: false,
                message: error.message || 'Ocorreu um erro ao procurar a medico.',
                error: error.message
            });
        }
    }
};

exports.create = async (req, res) => {
    try {
        const { cedula, password, nome_medico } = req.body;
        
        if (!cedula || !password || !nome_medico)
            return res.status(400).json({message: "Todos os campos são obrigatórios"})

        const medicoData = await medico.findOne({ where: { cedula: cedula } });

        if (medicoData) {
            return res.status(400).json({
                message: "Médico já existe"
            });
        } else {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const newMedico = {
                        cedula: cedula,
                        password: hash,
                        nome_medico: nome_medico,
                    };
                    medico.create(newMedico)
                        .then(result => {
                            console.log(result);
                            res.status(201).json({
                                message: "Médico criado"
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
                }
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || 'Ocorreu um erro ao criar o médico.',
            error: err.message
        });
    }
};