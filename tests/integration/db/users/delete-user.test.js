require('dotenv').config(); // read environment variables from .env file
const db = require("../../../../models/index");
const sequelize = db.sequelize;
const dbConfig = require('../../../../config/db.config.js');
console.log(dbConfig);

describe(' Delete an User from the Database', () => {
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

    test('Delete an user from the utilizador table', async () => {
        try {
            const result = await sequelize.query(`
                INSERT INTO utilizador (nome, password, email, tipo)
                VALUES ('Teste', 'Password123!', 'teste@mail.com', 'Paciente')
            `)            

            const [insertedUser] = await sequelize.query(`
                SELECT id_user FROM utilizador WHERE email = 'teste@mail.com'
            `);
            const userId = insertedUser[0].id_user;

            const deleteResult = await sequelize.query(`
                DELETE FROM utilizador WHERE id_user = ${userId}
            `);

            const [deletedUser] = await sequelize.query(`
                SELECT * FROM utilizador WHERE id_user = ${userId}
            `);

            expect(deletedUser).toHaveLength(0);

        } catch (error) {
            console.error('Error during test execution:', error);
            throw error;
        }
    });
});