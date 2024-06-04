const db = require("../models/index.js")
const Paciente = db.paciente;
const Consulta = db.consulta;
const Contacto = db.contacto;

//"Op" necessary for LIKE operator
const { Op, ValidationError } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
    const id_paciente = req.params.id;
    try {

        let paciente = await Paciente.findByPk(id_paciente, {
            attributes: ['nome', 'data_nascimento', 'n_utente', 'profissao', 'cod_postal', 'password'],
            include: [
                {
                    model: db.sistema_de_saude,
                    attributes: ['sistema_saude'],
                },
                {
                    model: db.contacto,
                    attributes: ['contacto'],
                },
                {
                    model: db.genero,
                    attributes: ['genero'],
                }
            ]
        });

        if (!paciente) {
            return res.status(404).json({
                success: false, 
                message: `Paciente with ID ${id_paciente} not found.`
            });
        }

        res.status(200).json({ 
            success: true, 
            data: paciente,
            links:[
                { "rel": "self", "href": `/pacientes/${id_paciente}`, "method": "GET" },
                { "rel": "delete", "href": `/pacientes/${id_paciente}`, "method": "DELETE" },
                { "rel": "modify", "href": `/pacientes/${id_paciente}`, "method": "PATCH" },
            ]
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false, 
            message: `Error retrieving Paciente with ID ${id_paciente}.`
        });
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
                    Paciente.create(newPaciente)
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

    Paciente.findOne({ where: { n_utente: n_utente } })
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

exports.update = async (req, res) => {
    let paciente;
    try {
        paciente = await Paciente.findByPk(req.params.id);

        if (!paciente) {
            return res.status(404).json({
                success: false, msg: `Paciente with ID ${req.params.id} not found.`
            });
        }

        let affectedRows = await paciente.update(req.body);

        if(affectedRows[0] === 0){
            return res.status(200).json({
                success: true, 
                msg: `No updates were made to paciente with ID ${req.params.id}.`
            });
        }

        return res.json({
            success: true,
            msg: `Paciente with ID ${req.params.id} was updated successfully.`
        });
    }
    catch (err) {
        if (err instanceof ValidationError)
            return res.status(400).json({ 
                success: false, 
                msg: err.errors.map(e => e.message) 
            });

        res.status(500).json({
            success: false, 
            msg: `Error retrieving paciente with ID ${req.params.id}.`
        });
    };
};

exports.delete = async (req, res) => {
    try {
        const paciente = await Paciente.findByPk(req.params.id);

        if (!paciente) {
            return res.status(404).json({
                success: false, msg: `Paciente with ID ${req.params.id} not found.`
            });
        }

            const consultas = await Consulta.findOne({
                where: { 
                    id_paciente: paciente.id_paciente
                }
            });

            if (consultas) {
                return res.status(400).json({
                    success: false,
                    msg: "Unable to delete the patient because there are consultas associated with him."
                });
            }

        const contacto = await Contacto.findOne({
            where: { 
                id_paciente: paciente.id_paciente
            }
        });

        if (contacto) {
            await contacto.destroy();
        }

        await paciente.destroy();

        return res.status(200).json({
            success: true, msg: `Paciente with ID ${req.params.id} has been deleted.`
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: err
        });
    }
};