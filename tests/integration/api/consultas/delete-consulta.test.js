const { deleteConsulta } = require('../../../../controllers/consultas.controller');
const Consulta = require('../../../../models/consultas.model');

jest.mock('../../../../models/consultas.model');

describe('DELETE consultas', () => {
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

    describe('deleteConsulta', () => {
        test('should return a 404 status if no consulta is found with the given id', async () => {
            Consulta.findByPk.mockResolvedValue(null);
    
            await deleteConsulta(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                msg: `Consulta with ID ${req.params.id} not found.`
            });
        });
    
        test('should return a 200 status if the consulta was deleted successfully', async () => {
            const analise = { destroy: jest.fn().mockResolvedValue() };
            Consulta.findByPk.mockResolvedValue(analise);
    
            await deleteConsulta(req, res);
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                msg: `Consulta with ID ${req.params.id} has been deleted.`
            });
        });

    });
});