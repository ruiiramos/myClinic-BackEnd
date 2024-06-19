const { updateMedicos, updatePacientes } = require('../../../../controllers/utilizadores.controller');
const Utilizador = require('../../../../models/utilizadores.model');

jest.mock('../../../../models/utilizadores.model');

describe('UPDATE Users', () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            body: {},
            params: {
                id: '1'
            }
        };

        res = {
            status: jest.fn(() => res),
            json: jest.fn(() => res)
        };
    });

    describe('updateMedicos', () => {
        test('should return a 404 status if no médico is found with the given id', async () => {
            Utilizador.findByPk.mockResolvedValue(null);
    
            await updateMedicos(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                msg: `Médico with ID ${req.params.id} not found.`
            });
        });

        test('should return a 200 status if no updates were made to the médico', async () => {
            const medico = { update: jest.fn().mockResolvedValue([0]) };
            Utilizador.findByPk.mockResolvedValue(medico);

            await updateMedicos(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                msg: `No updates were made to exame with ID ${req.params.id}.`
            });
        });

        test('should return a 200 status if the medico was updated successfully', async () => {
            const medico = { update: jest.fn().mockResolvedValue([1]) };
            Utilizador.findByPk.mockResolvedValue(medico);

            await updateMedicos(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                msg: `Utilizador with ID ${req.params.id} was updated successfully.`
            });
        });

    });
    
    describe('updatePacientes', () => {
        test('should return a 404 status if no paciente is found with the given id', async () => {
            Utilizador.findByPk.mockResolvedValue(null);
    
            await updatePacientes(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                msg: `Paciente with ID ${req.params.id} not found.`
            });
        });

        test('should return a 200 status if no updates were made to the paciente', async () => {
            const paciente = { update: jest.fn().mockResolvedValue([0]) };
            Utilizador.findByPk.mockResolvedValue(paciente);

            await updatePacientes(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                msg: `No updates were made to paciente with ID ${req.params.id}.`
            });
        });

        test('should return a 200 status if the paciente was updated successfully', async () => {
            const paciente = { update: jest.fn().mockResolvedValue([1]) };
            Utilizador.findByPk.mockResolvedValue(paciente);

            await updatePacientes(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                msg: `Utilizador with ID ${req.params.id} was updated successfully.`
            });
        });

    });
});