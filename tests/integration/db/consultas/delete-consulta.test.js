require('dotenv').config(); // read environment variables from .env file
const db = require("../../../../../models/index");
const sequelize = db.sequelize;
const dbConfig = require('../../../../../config/db.config.js');
console.log(dbConfig);

describe('Delete a Consulta from the Database', () => {
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

    test('Delete a consulta from the consulta table', async () => {
        try {
            const result = await sequelize.query(`
                INSERT INTO consulta (data, hora, preco_consulta, id_medico, id_paciente)
                VALUES ('2024-12-31', '12:00', 50.00, 31, 32)
            `)            

            const [insertedConsulta] = await sequelize.query(`
                SELECT id_consulta FROM consulta WHERE data = '2024-12-31' AND hora = '12:00'
            `);
            const consultaId = insertedConsulta[0].id_consulta;

            const deleteResult = await sequelize.query(`
                DELETE FROM consulta WHERE id_consulta = ${consultaId}
            `);

            const [deletedConsulta] = await sequelize.query(`
                SELECT * FROM consulta WHERE id_consulta = ${consultaId}
            `);

            expect(deletedConsulta).toHaveLength(0);

        } catch (error) {
            console.error('Error during test execution:', error);
            throw error;
        }
    });
});