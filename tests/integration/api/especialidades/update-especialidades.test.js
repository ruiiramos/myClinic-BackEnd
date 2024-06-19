const { update } = require('../../../../controllers/especialidade.controller');
const Especialidade = require('../../../../models/especialidade.model');

jest.mock('../../../../models/especialidade.model');

describe('UPDATE Especialidades', () => {
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
        test('should return a 404 status if no especialidade is found with the given id', async () => {
            Especialidade.findByPk.mockResolvedValue(null);

            await update(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                msg: `Especialidade with ID ${req.params.id} not found.`
            });
        });

        test('should return a 200 status if no updates were made to the especialidade', async () => {
            const especialidade = { update: jest.fn().mockResolvedValue([0]) };
            Especialidade.findByPk.mockResolvedValue(especialidade);

            await update(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                msg: `No updates were made to especialidade with ID ${req.params.id}.`
            });
        });

        test('should return a 200 status if the consulta was updated successfully', async () => {
            const especialidade = { update: jest.fn().mockResolvedValue([1]) };
            Especialidade.findByPk.mockResolvedValue(especialidade);

            await update(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                msg: `Especialidade with ID ${req.params.id} was updated successfully.`
            });
        });
    });
});