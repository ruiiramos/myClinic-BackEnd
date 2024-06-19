const { deleteAnalise } = require('../../../../controllers/analises.controller');
const Analise = require('../../../../models/analises.model');

jest.mock('../../../../models/analises.model');

describe('DELETE Análises', () => {
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

    describe('deleteAnalise', () => {
        test('should return a 404 status if no analise is found with the given id', async () => {
            Analise.findByPk.mockResolvedValue(null);
    
            await deleteAnalise(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                msg: `Análise with ID ${req.params.id} not found.`
            });
        });
    
        test('should return a 200 status if the analise was deleted successfully', async () => {
            const analise = { destroy: jest.fn().mockResolvedValue() };
            Analise.findByPk.mockResolvedValue(analise);
    
            await deleteAnalise(req, res);
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                msg: `Análise with ID ${req.params.id} has been deleted.`
            });
        });

    });
});