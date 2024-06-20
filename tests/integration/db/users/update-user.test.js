require('dotenv').config();
const db = require("../../../../models/index");
const Utilizador = db.utilizador;
const sequelize = db.sequelize;
const dbConfig = require('../../../../config/db.config.js');
console.log(dbConfig);

describe('Update an user in the Database', () => {
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

    test('Update an user with a non-existent id_user', async () => {
        const nonExistentUserId = 9999; 
        const updatedUserData = {
            nome: "aaa",
        };

        try {
            const [results] = await sequelize.query(`
                UPDATE utilizador
                SET nome = '${updatedUserData.nome}'
                WHERE id_user = ${nonExistentUserId}
            `);

            const { affectedRows } = results;
            console.log(affectedRows);

            expect(affectedRows).toBe(0);
        } catch (error) {
            console.error('Error during test execution:', error);
            throw error;
        }
    });

    test('Update an user in the utilizador table', async () => {
        try {
            const result = await sequelize.query(`
                INSERT INTO utilizador (nome, password, email, tipo)
                VALUES ('Teste', 'Password123!', 'teste@mail.com', 'Paciente')
            `)     

            const [insertedUser] = await sequelize.query(`
                SELECT id_user FROM utilizador WHERE email = 'teste@mail.com'
            `);
            const userId = insertedUser[0].id_user;

            const updateResult = await sequelize.query(`
                UPDATE utilizador
                SET nome = 'Updated Teste'
                WHERE id_user = ${userId}
            `);

            const [updatedUser] = await sequelize.query(`
                SELECT * FROM utilizador WHERE id_user = ${userId}
            `);

            expect(updatedUser[0]).toBeDefined();
            expect(updatedUser[0].nome).toBe('Updated Teste');

            await sequelize.query(`
                DELETE FROM utilizador WHERE id_user = ${userId}
            `);
        } catch (error) {
            console.error('Error during test execution:', error);
            throw error;
        }
    });
}); 