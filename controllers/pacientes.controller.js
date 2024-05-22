const db = require("../models/index.js")
const Paciente = db.paciente;

//"Op" necessary for LIKE operator
const { Op, ValidationError } = require('sequelize');
const { ErrorHandler } = require("../utils/error.js");
const { JWTconfig } = require("../utils/config.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

exports.create = async (req, res) => {
    try {
        const { n_Utente, password, nome, dataNascimento, profissão } = req.body;
        
        if (!n_Utente || !password || !nome || !dataNascimento || !profissão)
            throw new ErrorHandler(400, 'Todos os campos são obrigatórios.');

        const paciente = await Paciente.find({ n_Utente: n_Utente });

        if (paciente.length >= 1) {
            return res.status(400).json({
                message: "Utente já existe"
            });
        } else {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const newUser = {
                        n_Utente: n_Utente,
                        password: hash,
                        nome: nome,
                        dataNascimento: dataNascimento,
                        profissão: profissão
                    };
                    User.create(newUser)
                        .then(result => {
                            console.log(result);
                            res.status(201).json({
                                message: "Utente criado"
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
            message: err.message || 'Ocorreu um erro ao criar o utente.',
            error: err.message
        });
    }
};