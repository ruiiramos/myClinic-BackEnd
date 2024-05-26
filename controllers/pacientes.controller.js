const db = require("../models/index.js")
const paciente = db.paciente;

//"Op" necessary for LIKE operator
const { Op, ValidationError } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Display list of all pacientes
exports.findAll = async (req, res) => {
    try {
        let pacientes = await paciente.findAll() 
        
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
        const pacienteData = await paciente.findByPk(id);

        if (pacienteData) {
            return res.status(200).json({
                success: true,
                data: pacienteData
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'paciente não encontrada.'
            });
        }
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(400).json({
                success: false,
                message: error.message || 'Erro de validação ao procurar a paciente.',
                error: error.errors
            });
        } else {
            return res.status(500).json({
                success: false,
                message: error.message || 'Ocorreu um erro ao procurar a paciente.',
                error: error.message
            });
        }
    }
};

exports.create = async (req, res) => {
    try {
        const { n_utente, password, nome, data_nascimento, profissao, id_genero, cod_postal, id_sistema_saude } = req.body;
        
        if (!n_utente || !password || !nome || !data_nascimento || !profissao || !id_genero || !cod_postal || !id_sistema_saude)
            return res.status(400).json({message: "Todos os campos são obrigatórios"})

        const pacienteData = await paciente.findOne({ where: { n_utente: n_utente } });

        if (pacienteData) {
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
                    const newPaciente = {
                        n_utente: n_utente,
                        password: hash,
                        nome: nome,
                        data_nascimento: data_nascimento,
                        profissao: profissao,
                        id_genero: id_genero,
                        cod_postal: cod_postal,
                        id_sistema_saude: id_sistema_saude
                    };
                    paciente.create(newPaciente)
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

exports.login = (req, res, next) => {
    const n_utente = req.body.n_utente;
    const password = req.body.password;

    paciente.findOne({ n_utente: n_utente })
        .then(paciente => {
            if (!paciente) {
                return res.status(401).json({
                    message: "Authentication failed"
                });
            }

            bcrypt.compare(password, paciente.password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Authentication failed"
                    });
                }

                if (result) {
                    const token = jwt.sign(
                        {
                            n_utente: paciente.n_utente,
                            userId: paciente._id
                        },
                            process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        }
                    );

                    return res.status(200).json({
                        message: "Authentication successful",
                        token: token
                    });
                }

                res.status(401).json({
                    message: "Authentication failed"
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};