const dbConfig = require('../config/db.config.js');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect
    ,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection do DB has been established successfully.');
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
})();

const db = {};
//export the sequelize object (DB connection)
db.sequelize = sequelize;

//export ANALISE model
db.analise = require("./analises.model.js")(sequelize, DataTypes);
//export NOME_ANALISE model
db.nome_analise = require("./nomeAnalise.model.js")(sequelize, DataTypes);
//export CONSULTA model
db.consulta = require("./consultas.model.js")(sequelize, DataTypes);
//export TUTORIAL model
db.especialidade = require("./especialidade.model.js")(sequelize, DataTypes);
//export EXAME model
db.exame = require("./exames.model.js")(sequelize, DataTypes);
//export UTILIZADOR model
db.utilizador = require("./utilizadores.model.js")(sequelize, DataTypes);
//export CODPOSTAL model
db.codigo_postal = require("./codPostal.model.js")(sequelize, DataTypes);
//export GENERO model
db.genero = require("./genero.model.js")(sequelize, DataTypes);
//export MEDICAMENTO_PRESCRICAO model
db.medicamento_prescricao = require("./medicamentoPrescricao.model.js")(sequelize, DataTypes);
//export MEDICAMENTO model
db.medicamento = require("./medicamentos.model.js")(sequelize, DataTypes);
//export NOME_EXAME model
db.nome_exame = require("./nomeExame.model.js")(sequelize, DataTypes);
//export PRESCRICAO model
db.prescricao = require("./prescricao.model.js")(sequelize, DataTypes);
//export SISTEMA_DE_SAUDE model
db.sistema_de_saude = require("./sistSaude.model.js")(sequelize, DataTypes);
//export USER_CODES model
db.user_codes = require("./userCodes.model.js")(sequelize, DataTypes);
//export USER_TOKENS model
db.user_tokens = require("./userTokens.model.js")(sequelize, DataTypes);


/* ***********************************************************************************
                                        RELATIONSHIPS 
**************************************************************************************
*/

/* *************************************************
                RELATIONSHIPS UTILIZADORES
****************************************************
*/

// 1 sistema de saude : N utilizadores
db.sistema_de_saude.hasMany(db.utilizador, {
    foreignKey: "id_sistema_saude"
});
db.utilizador.belongsTo(db.sistema_de_saude, {
    foreignKey: "id_sistema_saude"
});

// 1 codigo postal : N utilizadores
db.codigo_postal.hasMany(db.utilizador, {
    foreignKey: "cod_postal"
});
db.utilizador.belongsTo(db.codigo_postal, {
    foreignKey: "cod_postal"
});

// 1 genero : N utilizadores
db.genero.hasMany(db.utilizador, {
    foreignKey: "id_genero"
});
db.utilizador.belongsTo(db.genero, {
    foreignKey: "id_genero"
});

// 1 paciente : N consultas
db.utilizador.hasMany(db.consulta, {
    as: "paciente",
    foreignKey: "id_paciente"
});
db.consulta.belongsTo(db.utilizador, {
    as: "paciente",
    foreignKey: "id_paciente"
});

// 1 medico : N consultas
db.utilizador.hasMany(db.consulta, {
    as: "medico",
    foreignKey: "id_medico"
});
db.consulta.belongsTo(db.utilizador, {
    as: "medico",
    foreignKey: "id_medico"
});

// 1 genero : N utilizadores
db.genero.hasMany(db.utilizador, {
    foreignKey: "id_genero"
});
db.utilizador.belongsTo(db.genero, {
    foreignKey: "id_genero"
});

// 1 especialidade : N utilizadores
db.especialidade.hasMany(db.utilizador, {
    foreignKey: "id_especialidade"
});
db.utilizador.belongsTo(db.especialidade, {
    foreignKey: "id_especialidade"
});

// 1 utilizador : N userCodes
db.user_codes.hasMany(db.utilizador, {
    foreignKey: "id_user"
});
db.utilizador.belongsTo(db.user_codes, {
    foreignKey: "id_user"
});

// 1 utilizador : N userTokens
db.user_tokens.hasMany(db.utilizador, {
    foreignKey: "id_user"
});
db.utilizador.belongsTo(db.user_tokens, {
    foreignKey: "id_user"
});
/* *************************************************
                RELATIONSHIPS CONSULTA
****************************************************
*/

// 1 consulta : N prescricoes
db.consulta.hasMany(db.prescricao, {
    foreignKey: "id_consulta"
});
db.prescricao.belongsTo(db.consulta, {
    foreignKey: "id_consulta"
});

// 1 consulta : N exames
db.consulta.hasMany(db.exame, {
    foreignKey: "id_consulta"
});
db.exame.belongsTo(db.consulta, {
    foreignKey: "id_consulta"
});

// 1 consulta : N analises
db.consulta.hasMany(db.analise, {
    foreignKey: "id_consulta"
});
db.analise.belongsTo(db.consulta, {
    foreignKey: "id_consulta"
});

/* *************************************************
                RELATIONSHIPS EXAME 
****************************************************
*/

// 1 especialidade : N exames
db.especialidade.hasMany(db.exame, {
    foreignKey: "id_especialidade"
});
db.exame.belongsTo(db.especialidade, {
    foreignKey: "id_especialidade"
});

// 1 nome_exame : N exames
db.nome_exame.hasMany(db.exame, {
    foreignKey: "id_exame"
});
db.exame.belongsTo(db.nome_exame, {
    foreignKey: "id_exame"
});

// 1 nome_analise : N analises
db.nome_analise.hasMany(db.analise, {
    foreignKey: "id_analise"
});
db.analise.belongsTo(db.nome_analise, {
    foreignKey: "id_analise"
});

/* *************************************************
                RELATIONSHIPS PRESCRICAO 
****************************************************
*/

// 1 prescricao : N medicamento_prescricao
db.prescricao.hasMany(db.medicamento_prescricao, {
    foreignKey: "id_prescricao"
});
db.medicamento_prescricao.belongsTo(db.prescricao, {
    foreignKey: "id_prescricao"
});

/* *************************************************
                RELATIONSHIPS MEDICAMENTO 
****************************************************
*/

// 1 medicamento : N medicamento_prescricao
db.medicamento.hasMany(db.medicamento_prescricao, {
    foreignKey: "id_medicamento"
});
db.medicamento_prescricao.belongsTo(db.medicamento, {
    foreignKey: "id_medicamento"
});

/* // // optionally: SYNC
    (async () => {
    try {
        // await sequelize.sync({ force: true }); // creates tables, dropping them first if they already existed
       await sequelize.sync({ alter: true }); // checks the tables in the database (which columns they have, what are their data types, etc.), and then performs the necessary changes to make then match the models
       await sequelize.sync(); // creates tables if they don't exist (and does nothing if they already exist)
       console.log('DB is successfully synchronized')
    } catch (error) {
       console.log(error)
    }
 })(); */
module.exports = db;