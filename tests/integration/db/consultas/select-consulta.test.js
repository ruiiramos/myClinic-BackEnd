require('dotenv').config(); // read environment variables from .env file
const db = require("../../../../models/index");
const sequelize = db.sequelize;
const dbConfig = require('../../../../config/db.config.js');
console.log(dbConfig);

describe('Select All Consultas from consulta table on the database', () => {
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

    test('Fetch all consultas from the database', async () => {
        try {
            const result = await sequelize.query(`
                SELECT * FROM consulta
            `)            

            expect(result).toBeTruthy();
        } catch (error) {
            console.error('Error during test execution:', error);
            throw error;
        }
    });
});