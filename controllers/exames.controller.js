const db = require("../models/index.js")
const Exame = db.exame;
const nomeExame = db.nome_exame

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
                message: 'Exame não encontrado.'
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
        const { data, hora, id_consulta, especialidade, nome_exame } = req.body;
    
        if (!data || !hora || !id_consulta || !especialidade || !nome_exame) {
            return res.status(400).json({
                message: "Todos os campos são obrigatórios!"
            });
        }

        const especialidadeMap = { 'Cardiologia': 1, 'Dermatologia': 2, 'Pediatria': 3, 'Endocrinologia': 4, 'Estomatologia': 5, 'Gastrenterologia': 6, 'Ginecologia': 7, 'Hematologia': 8, 'Medicina Geral': 9, 'Nefrologia': 10, 'Neurologia': 11, 'Oftalmologia': 12, 'Ortopedia': 13, 'Otorrinolaringologia': 14, 'Psiquiatria': 15, 'Radiologia': 16, 'Reumatologia': 17, 'Urologia': 18 };
        const id_especialidade = especialidadeMap[especialidade];

        let nomeExameData = await nomeExame.findOne({ where: { nome_exame: nome_exame } });
        if (!nomeExameData) {
            nomeExameData = await nomeExame.create({ nome_exame: nome_exame });
        }

        let existingExame = await Exame.findOne({ where: { nome_exame: nome_exame} });
    
        if (existingExame) {
            return res.status(400).json({
                message: "Exame já existe"
            });
        } else if (!id_especialidade || !especialidade) {
            return res.status(400).json({
                success: false, message: `Especialidade ${especialidade} doesn't exist.`
            });
        } else {
            const newExame = {
                data: data,
                hora: hora,
                id_consulta: id_consulta,
                id_especialidade: id_especialidade,
                nome_exame: nome_exame
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

exports.update = async (req, res) => {
    let exame;
    try {
        exame = await Exame.findByPk(req.params.id);

        if (!exame) {
            return res.status(404).json({
                success: false, msg: `Exame with ID ${req.params.id} not found.`
            });
        }

        let affectedRows = await exame.update(req.body);

        if(affectedRows[0] === 0){
            return res.status(200).json({
                success: true, 
                msg: `No updates were made to exame with ID ${req.params.id}.`
            });
        }

        return res.json({
            success: true,
            msg: `Exame with ID ${req.params.id} was updated successfully.`
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
            msg: `Error retrieving exame with ID ${req.params.id}.`
        });
    };
};

exports.deleteExame = async (req, res) => {
    try {
        const exame = await Exame.findByPk(req.params.id);

        if (!exame) {
            return res.status(404).json({
                success: false, msg: `Exame with ID ${req.params.id} not found.`
            });
        }

        await exame.destroy();

        return res.status(200).json({
            success: true, msg: `Exame with ID ${req.params.id} has been deleted.`
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: err
        });
    }
};
