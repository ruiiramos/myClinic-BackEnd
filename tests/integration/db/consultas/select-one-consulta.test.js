require('dotenv').config();
const db = require("../../../../models/index");
const sequelize = db.sequelize;
const dbConfig = require('../../../../config/db.config.js');
console.log(dbConfig);

describe('Select One Consulta from database', () => {
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

    test('Get a consulta with a non-existent id_consulta', async () => {
        try {
            const result = await sequelize.query(`
                SELECT * FROM consulta WHERE id_consulta = 9999
            `)            

            expect(result[0]).toHaveLength(0)
        } catch (error) {
            console.error('Error during test execution:', error);
            throw error;
        }
    });

    test('Get a specific consulta with a valid id_consulta', async () => {
        const existingConsultaId = 11; 

        try {
            const result = await sequelize.query(`SELECT * FROM consulta WHERE id_consulta = ${existingConsultaId}`);

            expect(result[0]).toHaveLength(1);
            const consulta = result[0][0];
            expect(consulta.id_consulta).toBe(existingConsultaId);
            expect(consulta).toHaveProperty('consulta');
        } catch (error) {
            console.error('Error during test execution:', error);
            throw error;
        }
    });
});