const db = require("../models/index.js")
const Exame = db.exame;

//"Op" necessary for LIKE operator
const { Op, ValidationError } = require('sequelize');

exports.findAll = async (req, res) => {
    try {
        let exames = await Exame.findAll() 

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
        const exameData = await Exame.findByPk(id);

        if (exameData) {
            return res.status(200).json({
                success: true,
                data: exameData
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'exame não encontrada.'
            });
        }
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(400).json({
                success: false,
                message: error.message || 'Erro de validação ao procurar a exame.',
                error: error.errors
            });
        } else {
            return res.status(500).json({
                success: false,
                message: error.message || 'Ocorreu um erro ao procurar a exame.',
                error: error.message
            });
        }
    }
};

exports.create = async (req, res) => {
    try {
        const { data, hora, id_consulta, id_especialidade, id_nome_exame } = req.body;
    
        if (!data || !hora || !id_consulta || !id_especialidade || !id_nome_exame) {
            return res.status(400).json({
                message: "Todos os campos são obrigatórios!"
            });
        }
    
        const existingExame = await Exame.findOne({ where: { nome_exame: nome_exame } });
    
        if (existingExame) {
            return res.status(400).json({
                message: "Especialidade já existe"
            });
        } else {
            const newExame = {
                data: data,
                hora: hora,
                id_consulta: id_consulta,
                id_especialidade: id_especialidade,
                id_nome_exame: id_nome_exame
            };
    
            Exame.create(newExame)
            .then(result => {
                res.status(201).json({
                    success: true,
                    message: "Exame criado com sucesso",
                    data: result
                });
            })
            .catch(err => {
                res.status(500).json({
                    success: false,
                    message: err.message || "Erro ao criar o exame"
                });
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Erro ao criar o exame"
        });   
    }
};