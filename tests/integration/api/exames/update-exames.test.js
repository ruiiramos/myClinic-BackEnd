const { update } = require('../../../../controllers/exames.controller');
const Exame = require('../../../../models/exames.model');

jest.mock('../../../../models/exames.model');

describe('UPDATE Exames', () => {
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
        test('should return a 404 status if no exame is found with the given id', async () => {
            Exame.findByPk.mockResolvedValue(null);

            await update(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                msg: `Exame with ID ${req.params.id} not found.`
            });
        });

        test('should return a 200 status if no updates were made to the exame', async () => {
            const exame = { update: jest.fn().mockResolvedValue([0]) };
            Exame.findByPk.mockResolvedValue(exame);

            await update(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                msg: `No updates were made to exame with ID ${req.params.id}.`
            });
        });

        test('should return a 200 status if the exame was updated successfully', async () => {
            const exame = { update: jest.fn().mockResolvedValue([1]) };
            Exame.findByPk.mockResolvedValue(exame);

            await update(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                msg: `Exame with ID ${req.params.id} was updated successfully.`
            });
        });
    });
});