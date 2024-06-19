const { deleteExame } = require('../../../../controllers/exames.controller');
const Consulta = require('../../../../models/exames.model');

jest.mock('../../../../models/exames.model');

describe('DELETE exames', () => {
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

    describe('deleteExame', () => {
        test('should return a 404 status if no exame is found with the given id', async () => {
            Exame.findByPk.mockResolvedValue(null);
    
            await deleteExame(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                msg: `Exame with ID ${req.params.id} not found.`
            });
        });
    
        test('should return a 200 status if the exame was deleted successfully', async () => {
            const exame = { destroy: jest.fn().mockResolvedValue() };
            Consulta.findByPk.mockResolvedValue(exame);
    
            await deleteExame(req, res);
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                msg: `Exame with ID ${req.params.id} has been deleted.`
            });
        });

    });
});