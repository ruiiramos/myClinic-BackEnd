require('dotenv').config(); // read environment variables from .env file
const db = require("../../../../../models/index");
const sequelize = db.sequelize;
const dbConfig = require('../../../../../config/db.config.js');
console.log(dbConfig);

describe('Delete an Especialidade from the Database', () => {
    beforeAll(async () => {
        try {
            await sequelize.authenticate();
            console.log('Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
            throw error;
        }
    });

    afterAll(async () => {
        try {
            await sequelize.close();
            console.log('Connection closed successfully.');
        } catch (error) {
            console.error('Error closing database connection:', error);
            throw error;
        }
    });

    test('Delete an especialidade from the especialidade table', async () => {
        try {
            const result = await sequelize.query(`
                INSERT INTO especialidade (especialidade)
                VALUES ('Teste')
            `)            

            const [insertedEspecialidade] = await sequelize.query(`
                SELECT id_especialidade FROM especialidade WHERE especialidade = 'Teste'
            `);
            const especialidadeId = insertedEspecialidade[0].id_especialidade;

            const deleteResult = await sequelize.query(`
                DELETE FROM especialidade WHERE id_especialidade = ${especialidadeId}
            `);

            const [deletedEspecialidade] = await sequelize.query(`
                SELECT * FROM especialidade WHERE id_especialidade = ${especialidadeId}
            `);

            expect(deletedEspecialidade).toHaveLength(0);

        } catch (error) {
            console.error('Error during test execution:', error);
            throw error;
        }
    });
});