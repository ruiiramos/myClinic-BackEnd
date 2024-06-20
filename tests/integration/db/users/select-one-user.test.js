require('dotenv').config(); // read environment variables from .env file
const db = require("../../../../models/index");
const sequelize = db.sequelize;
const dbConfig = require('../../../../config/db.config.js');
console.log(dbConfig);

describe('Select One User from database', () => {
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

    test('Get a user with a non-existent id_user', async () => {
        try {
            const result = await sequelize.query(`
                SELECT * FROM utilizador WHERE id_user = 9999
            `)            

            expect(result[0]).toHaveLength(0)
        } catch (error) {
            console.error('Error during test execution:', error);
            throw error;
        }
    });

    test('Get an user with a valid id_user', async () => {
        const existingUserId = 4; 

        try {
            const result = await sequelize.query(`SELECT * FROM utilizador WHERE id_user = ${existingUserId}`);

            expect(result[0]).toHaveLength(1);
            const user = result[0][0];
            expect(user.id_user).toBe(existingUserId);
            expect(user).toHaveProperty('nome');
            expect(user).toHaveProperty('email');
        } catch (error) {
            console.error('Error during test execution:', error);
            throw error;
        }
    });
});