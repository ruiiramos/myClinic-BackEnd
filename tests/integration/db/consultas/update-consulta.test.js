require('dotenv').config();
const db = require("../../../../models/index");
const Consulta = db.consulta;
const sequelize = db.sequelize;
const dbConfig = require('../../../../config/db.config.js');
console.log(dbConfig);

describe('Update a consulta in the Database', () => {
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

    test('Update a consulta with a non-existent id_consulta', async () => {
        const nonExistentConsultaId = 9999; 
        const updatedConsultaData = {
            data: "2024-07-15",
        };

        try {
            const [results] = await sequelize.query(`
                UPDATE consulta
                SET data = '${updatedConsultaData.data}'
                WHERE id_consulta = ${nonExistentConsultaId}
            `);

            const { affectedRows } = results;
            console.log(affectedRows);

            expect(affectedRows).toBe(0);
        } catch (error) {
            console.error('Error during test execution:', error);
            throw error;
        }
    });

    test('Update a consulta in the consulta table', async () => {
        try {
            const result = await sequelize.query(`
                INSERT INTO consulta (data, hora, preco_consulta, id_medico, id_paciente)
                VALUES ('2024-12-31', '12:00', 50.00, 1, 1)
            `)     

            const [insertedConsulta] = await sequelize.query(`
                SELECT id_consulta FROM consulta WHERE data = '2024-12-31' AND hora = '12:00'
            `);
            const consultaId = insertedConsulta[0].id_consulta;

            const updateResult = await sequelize.query(`
                UPDATE consulta
                SET data = '2024-07-01'
                WHERE id_consulta = ${consultaId}
            `);

            const [updatedConsulta] = await sequelize.query(`
                SELECT * FROM consulta WHERE id_consulta = ${consultaId}
            `);

            expect(updatedConsulta[0]).toBeDefined();
            expect(updatedConsulta[0].data).toBe('2024-07-01');

            await sequelize.query(`
                DELETE FROM consulta WHERE id_consulta = ${consultaId}
            `);
        } catch (error) {
            console.error('Error during test execution:', error);
            throw error;
        }
    });
});