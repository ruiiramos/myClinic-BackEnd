const { update } = require('../../../../controllers/analises.controller');
const Analise = require('../../../../models/analises.model');

jest.mock('../../../../models/analises.model');

describe('UPDATE Análises', () => {
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

    describe('update', () => {
        test('should return a 404 status if no analise is found with the given id', async () => {
            Analise.findByPk.mockResolvedValue(null);

            await update(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                msg: `Análise with ID ${req.params.id} not found.`
            });
        });

        test('should return a 200 status if no updates were made to the analise', async () => {
            const analise = { update: jest.fn().mockResolvedValue([0]) };
            Analise.findByPk.mockResolvedValue(analise);

            await update(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                msg: `No updates were made to análise with ID ${req.params.id}.`
            });
        });

        test('should return a 200 status if the analise was updated successfully', async () => {
            const analise = { update: jest.fn().mockResolvedValue([1]) };
            Analise.findByPk.mockResolvedValue(analise);

            await update(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                msg: `Análise with ID ${req.params.id} was updated successfully.`
            });
        });
    });
});