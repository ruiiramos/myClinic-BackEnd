const db = require("../models/index.js")
const Analise = db.analise;

//"Op" necessary for LIKE operator
const { Op, ValidationError } = require('sequelize');

// Display list of all analises
exports.findAll = async (req, res) => {
    try {
        let analises = await Analise.findAll() 
        
        // Send response with pagination and data
        res.status(200).json({ 
            success: true, 
            data: analises
        });
    }
    catch (err) {
        if (err instanceof ValidationError) {
            return res.status(400).json({ success: false, message: err.message || 'Erro de validação ao procurar as analises.', error: err.message });
        } else {
            res.status(500).json({
                success: false, msg: err.message || "Ocorreu um erro ao procurar as análises."
            })
        }
    }
};

exports.findOne = async (req, res) => {
    try {
        const id = req.params.id;
        const analiseData = await Analise.findByPk(id);

        if (analiseData) {
            return res.status(200).json({
                success: true,
                data: analiseData
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'Análise não encontrada.'
            });
        }
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(400).json({
                success: false,
                message: error.message || 'Erro de validação ao procurar a análise.',
                error: error.errors
            });
        } else {
            return res.status(500).json({
                success: false,
                message: error.message || 'Ocorreu um erro ao procurar a análise.',
                error: error.message
            });
        }
    }
};

exports.create = async (req, res) => {
    try {
        const { resultado, preco_analise, data, id_consulta } = req.body;
        
        if (!resultado || !preco_analise || !data || !id_consulta)
            return res.status(400).json({message: "Todos os campos são obrigatórios"})

        const newAnalise = {
            resultado: resultado,
            preco_analise: preco_analise,
            data: data,
            id_consulta: id_consulta
        };

        Analise.create(newAnalise)
            .then(result => {
                res.status(201).json({
                    success: true,
                    message: "Análise criada",
                    data: result
                });
            })
            .catch(err => {
                res.status(500).json({
                    success: false,
                    error: err.message || "Erro ao criar a análise"
                });
            });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || "Erro ao criar a análise"
        });
    }
};

exports.update = async (req, res) => {
    let analise;
    try {
        analise = await Analise.findByPk(req.params.id);

        if (!analise) {
            return res.status(404).json({
                success: false, msg: `Análise with ID ${req.params.id} not found.`
            });
        }

        let affectedRows = await analise.update(req.body);

        if(affectedRows[0] === 0){
            return res.status(200).json({
                success: true, 
                msg: `No updates were made to análise with ID ${req.params.id}.`
            });
        }

        return res.json({
            success: true,
            msg: `Análise with ID ${req.params.id} was updated successfully.`
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
            msg: `Error retrieving análise with ID ${req.params.id}.`
        });
    };
};

exports.delete = async (req, res) => {
    try {
        const analise = await Analise.findByPk(req.params.id);

        if (!analise) {
            return res.status(404).json({
                success: false, msg: `Análise with ID ${req.params.id} not found.`
            });
        }

        await analise.destroy();

        return res.status(200).json({
            success: true, msg: `Análise with ID ${req.params.id} has been deleted.`
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: err
        });
    }
};