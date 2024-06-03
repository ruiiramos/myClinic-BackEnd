const db = require("../models/index.js")
const Consulta = db.consulta;
const Exame = db.exame;
const Analise = db.analise;

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
        const consultaData = await Consulta.findByPk(id);

        if (consultaData) {
            return res.status(200).json({
                success: true,
                data: consultaData
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'Consulta não encontrada.'
            });
        }
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(400).json({
                success: false,
                message: error.message || 'Erro de validação ao procurar a consulta.',
                error: error.errors
            });
        } else {
            return res.status(500).json({
                success: false,
                message: error.message || 'Ocorreu um erro ao procurar a consulta.',
                error: error.message
            });
        }
    }
};

exports.findByPaciente = async (req, res) => {
    try {
        const id_paciente = req.params.id;
        const consultas = await Consulta.findAll({where: { id_paciente: id_paciente }});

        if (consultas && consultas.length > 0) {
            return res.status(200).json({
                success: true,
                data: consultas
            });
        } else {
            return res.status(404).json({
                success: false,
                message: `Nenhuma consulta encontrada para o paciente com ID ${id_paciente}.`
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Ocorreu um erro ao procurar as consultas.',
            error: error.message
        });
    }
};

exports.findByMedico = async (req, res) => {
    try {
        const id_medico = req.params.id;
        const consultas = await Consulta.findAll({where: { id_medico: id_medico }});

        if (consultas && consultas.length > 0) {
            return res.status(200).json({
                success: true,
                data: consultas
            });
        } else {
            return res.status(404).json({
                success: false,
                message: `Nenhuma consulta encontrada para o médico com ID ${id_medico}.`
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Ocorreu um erro ao procurar as consultas.',
            error: error.message
        });
    }
};

exports.create = async (req, res) => {
    try {
        const { data, hora, preco_consulta, id_medico, id_paciente } = req.body;
        
        if (!data || !hora || !preco_consulta || !id_medico || !id_paciente)
            return res.status(400).json({message: "Todos os campos são obrigatórios"})

        const newConsulta = {
            data: data,
            hora: hora,
            preco_consulta: preco_consulta,
            id_medico: id_medico,
            id_paciente: id_paciente
        };

        Consulta.create(newConsulta)
            .then(result => {
                res.status(201).json({
                    success: true,
                    message: "Consulta criada",
                    data: result
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    success: false,
                    error: err.message || "Erro ao criar consulta"
                });
            });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false, 
            error: error.message || "Erro ao criar consulta"
        });
    }
};

exports.update = async (req, res) => {
    let consulta;
    try {
        consulta = await Consulta.findByPk(req.params.id);

        if (!consulta) {
            return res.status(404).json({
                success: false, msg: `Consulta with ID ${req.params.id} not found.`
            });
        }

        let affectedRows = await consulta.update(req.body);

        if(affectedRows[0] === 0){
            return res.status(200).json({
                success: true, 
                msg: `No updates were made to consulta with ID ${req.params.id}.`
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
            msg: `Error retrieving consulta with ID ${req.params.id}.`
        });
    };
};