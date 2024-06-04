const db = require("../models/index.js")
const Medico = db.medico;
const Consulta = db.consulta;

//"Op" necessary for LIKE operator
const { Op, ValidationError } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
    const id_medico = req.params.id;
    try {

        let medico = await Medico.findByPk(id_medico, {
            attributes: ['nome_medico', 'cedula', 'password'],
            include: [
                {
                    model: db.especialidade,
                    attributes: ['especialidade'],
                },
            ]
        });

        if (!medico) {
            return res.status(404).json({
                success: false, 
                message: `Médico with ID ${id_medico} not found.`
            });
        }

        res.status(200).json({ 
            success: true, 
            data: medico,
            links:[
                { "rel": "self", "href": `/pacientes/${id_medico}`, "method": "GET" },
                { "rel": "delete", "href": `/pacientes/${id_medico}`, "method": "DELETE" },
                { "rel": "modify", "href": `/pacientes/${id_medico}`, "method": "PATCH" },
            ]
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false, 
            message: `Error retrieving médico with ID ${id_medico}.`
        });
    }
};

exports.create = async (req, res) => {
    try {
        const { cedula, password, nome_medico, id_especialidade } = req.body;
        
        if (!cedula || !password || !nome_medico || !id_especialidade)
            return res.status(400).json({message: "Todos os campos são obrigatórios"})

        const medicoData = await Medico.findOne({ where: { cedula: cedula } });

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
                        id_especialidade: id_especialidade
                    };
                    Medico.create(newMedico)
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

exports.login = (req, res, next) => {
    const cedula = req.body.cedula;
    const password = req.body.password;

    Medico.findOne({ where: { cedula: cedula } })
        .then(medico => {
            if (!medico) {
                return res.status(401).json({
                    message: "Authentication failed"
                });
            }

            bcrypt.compare(password, medico.password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Authentication failed"
                    });
                }

                if (result) {
                    const token = jwt.sign(
                        {
                            cedula: medico.cedula,
                            userId: medico._id
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

exports.update = async (req, res) => {
    let medico;
    try {
        medico = await Medico.findByPk(req.params.id);

        if (!medico) {
            return res.status(404).json({
                success: false, msg: `Médico with ID ${req.params.id} not found.`
            });
        }

        let affectedRows = await medico.update(req.body);

        if(affectedRows[0] === 0){
            return res.status(200).json({
                success: true, 
                msg: `No updates were made to médico with ID ${req.params.id}.`
            });
        }

        return res.json({
            success: true,
            msg: `Médico with ID ${req.params.id} was updated successfully.`
        });
    }
    catch (err) {
        console.error(err);
        if (err instanceof ValidationError)
            return res.status(400).json({ 
                success: false, 
                msg: err.errors.map(e => e.message) 
            });

        res.status(500).json({
            success: false, 
            msg: `Error retrieving médico with ID ${req.params.id}.`
        });
    };
};

exports.delete = async (req, res) => {
    try {
        const medico = await Medico.findByPk(req.params.id);

        if (!medico) {
            return res.status(404).json({
                success: false, msg: `Médico with ID ${req.params.id} not found.`
            });
        }

        const consultas = await Consulta.findOne({
            where: { 
                id_medico: medico.id_medico
            }
        });

        if (consultas) {
            return res.status(400).json({
                success: false,
                msg: "Unable to delete the médico because there are consultas associated with him."
            });
        }

        await medico.destroy();

        return res.status(200).json({
            success: true, msg: `Médico with ID ${req.params.id} has been deleted.`
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: err
        });
    }
};