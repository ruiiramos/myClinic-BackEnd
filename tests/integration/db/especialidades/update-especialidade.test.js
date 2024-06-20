require('dotenv').config();
const db = require("../../../../models/index");
const Especialidade = db.especialidade;
const sequelize = db.sequelize;
const dbConfig = require('../../../../config/db.config.js');
console.log(dbConfig);

describe('Update an especialidade in the Database', () => {
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

    test('Update an especialidade with a non-existent id_especialidade', async () => {
        const nonExistentEspecialidadeId = 9999; 
        const updatedEspecialidadeNome = {
            nome: "aaa",
        };

        try {
            const [results] = await sequelize.query(`
                UPDATE especialidade
                SET nome = '${updatedEspecialidadeNome.nome}'
                WHERE id_especialidade = ${nonExistentEspecialidadeId}
            `);

            const { affectedRows } = results;
            console.log(affectedRows);

            expect(affectedRows).toBe(0);
        } catch (error) {
            console.error('Error during test execution:', error);
            throw error;
        }
    });

    test('Update an especialidade in the especialidade table', async () => {
        try {
            const result = await sequelize.query(`
                INSERT INTO especialidade (especialidade)
                VALUES ('Teste')
            `)     

            const [insertedUser] = await sequelize.query(`
                SELECT id_especialidade FROM especialidade WHERE especialidade = 'Teste'
            `);
            const especialidadeId = insertedUser[0].id_especialidade;

            const updateResult = await sequelize.query(`
                UPDATE especialidade
                SET nome = 'Updated Teste'
                WHERE id_especialidade = ${especialidadeId}
            `);

            const [updatedUser] = await sequelize.query(`
                SELECT * FROM especialidade WHERE id_especialidade = ${especialidadeId}
            `);

            expect(updatedUser[0]).toBeDefined();
            expect(updatedUser[0].nome).toBe('Updated Teste');

            await sequelize.query(`
                DELETE FROM especialidade WHERE id_especialidade = ${especialidadeId}
            `);
        } catch (error) {
            console.error('Error during test execution:', error);
            throw error;
        }
    });
}); 