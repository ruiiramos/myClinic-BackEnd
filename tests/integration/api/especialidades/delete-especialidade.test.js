const { deleteEspecialidade } = require('../../../../controllers/especialidade.controller');
const Consulta = require('../../../../models/especialidade.model');

jest.mock('../../../../models/especialidade.model');

describe('DELETE especialidades', () => {
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

    describe('deleteEspecialidade', () => {
        test('should return a 404 status if no especialidade is found with the given id', async () => {
            Especialidade.findByPk.mockResolvedValue(null);
    
            await deleteEspecialidade(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                msg: `Especialidade with ID ${req.params.id} not found.`
            });
        });
    
        test('should return a 200 status if the consulta was deleted successfully', async () => {
            const especialidade = { destroy: jest.fn().mockResolvedValue() };
            Especialidade.findByPk.mockResolvedValue(especialidade);
    
            await deleteEspecialidade(req, res);
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                msg: `Especialidade with ID ${req.params.id} has been deleted.`
            });
        });

    });
});