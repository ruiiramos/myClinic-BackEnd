require('dotenv').config(); // read environment variables from .env file
const db = require("../../../../models/index");
const sequelize = db.sequelize;
const dbConfig = require('../../../../config/db.config.js');
console.log(dbConfig);

describe('Select One Especialidade from database', () => {
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

    test('Get an especialidade with a non-existent id_especialidade', async () => {
        try {
            const result = await sequelize.query(`
                SELECT * FROM especialidade WHERE id_especialidade = 9999
            `)            

            expect(result[0]).toHaveLength(0)
        } catch (error) {
            console.error('Error during test execution:', error);
            throw error;
        }
    });

    test('Get a specific especialidade with a valid id_especialidade', async () => {
        const existingEspecialidadeId = 1; 

        try {
            const result = await sequelize.query(`SELECT * FROM especialidade WHERE id_especialidade = ${existingEspecialidadeId}`);

            expect(result[0]).toHaveLength(1);
            const especialidade = result[0][0];
            expect(especialidade.id_especialidade).toBe(existingEspecialidadeId);
            expect(especialidade).toHaveProperty('especialidade');
        } catch (error) {
            console.error('Error during test execution:', error);
            throw error;
        }
    });
});