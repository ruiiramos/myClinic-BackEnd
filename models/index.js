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
//export CONSULTA model
db.consulta = require("./consultas.model.js")(sequelize, DataTypes);
//export TUTORIAL model
db.especialidade = require("./especialidade.model.js")(sequelize, DataTypes);
//export EXAME model
db.exame = require("./exames.model.js")(sequelize, DataTypes);
//export MEDICO model
db.medico = require("./medicos.model.js")(sequelize, DataTypes);
//export PACIENTE model
db.paciente = require("./pacientes.model.js")(sequelize, DataTypes);
//export ADMIN model
db.admin = require("./admin.model.js")(sequelize, DataTypes);
//export CODPOSTAL model
db.codigo_postal = require("./codPostal.model.js")(sequelize, DataTypes);
//export CONTACTO model
db.contacto = require("./contacto.model.js")(sequelize, DataTypes);
//export PACIENTE model
db.genero = require("./genero.model.js")(sequelize, DataTypes);
//export PACIENTE model
db.medicamento_prescricao = require("./medicamentoPrescricao.model.js")(sequelize, DataTypes);
//export PACIENTE model
db.medicamento = require("./medicamentos.model.js")(sequelize, DataTypes);
//export PACIENTE model
db.nome_exame = require("./nomeExame.model.js")(sequelize, DataTypes);
//export PACIENTE model
db.prescricao = require("./prescricao.model.js")(sequelize, DataTypes);
//export PACIENTE model
db.sistema_de_saude = require("./sistSaude.model.js")(sequelize, DataTypes);

// // optionally: SYNC
   /* (async () => {
    try {
        // await sequelize.sync({ force: true }); // creates tables, dropping them first if they already existed
       await sequelize.sync({ alter: true }); // checks the tables in the database (which columns they have, what are their data types, etc.), and then performs the necessary changes to make then match the models
       await sequelize.sync(); // creates tables if they don't exist (and does nothing if they already exist)
       console.log('DB is successfully synchronized')
    } catch (error) {
       console.log(error)
    }
 })(); 
 */
module.exports = db;
