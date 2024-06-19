const { deletePacientes, deleteMedicos } = require('../../../../controllers/utilizadores.controller');
const Utilizador = require('../../../../models/utilizadores.model');

jest.mock('../../../../models/utilizadores.model');

describe('DELETE utilizadores', () => {
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

    describe('deleteMedicos', () => {
        test('should return a 404 status if no medico is found with the given id', async () => {
            Utilizdor.findByPk.mockResolvedValue(null);
    
            await deleteMedicos(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                msg: `Médico with ID ${req.params.id} not found.`
            });
        });
    
        test('should return a 200 status if the medico was deleted successfully', async () => {
            const medico = { destroy: jest.fn().mockResolvedValue() };
            Utilizador.findByPk.mockResolvedValue(medico);
    
            await deleteMedicos(req, res);
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                msg: `Médico with ID ${req.params.id} has been deleted.`
            });
        });

    });

    describe('deletePacientes', () => {
        test('should return a 404 status if no paciente is found with the given id', async () => {
            Utilizador.findByPk.mockResolvedValue(null);
    
            await deletePacientes(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                msg: `Paciente with ID ${req.params.id} not found.`
            });
        });
    
        test('should return a 200 status if the paciente was deleted successfully', async () => {
            const paciente = { destroy: jest.fn().mockResolvedValue() };
            Utilizador.findByPk.mockResolvedValue(paciente);
    
            await deletePacientes(req, res);
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                msg: `Paciente with ID ${req.params.id} has been deleted.`
            });
        });

    });
});