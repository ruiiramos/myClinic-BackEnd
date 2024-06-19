const { update } = require('../../../../controllers/consultas.controller');
const Consulta = require('../../../../models/consultas.model');

jest.mock('../../../../models/consultas.model');

describe('UPDATE Consultas', () => {
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
        test('should return a 404 status if no consulta is found with the given id', async () => {
            Consulta.findByPk.mockResolvedValue(null);

            await update(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                msg: `Consulta with ID ${req.params.id} not found.`
            });
        });

        test('should return a 200 status if no updates were made to the consulta', async () => {
            const consulta = { update: jest.fn().mockResolvedValue([0]) };
            Consulta.findByPk.mockResolvedValue(consulta);

            await update(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                msg: `No updates were made to consulta with ID ${req.params.id}.`
            });
        });

        test('should return a 200 status if the consulta was updated successfully', async () => {
            const consulta = { update: jest.fn().mockResolvedValue([1]) };
            Consulta.findByPk.mockResolvedValue(consulta);

            await update(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                msg: `Consulta with ID ${req.params.id} was updated successfully.`
            });
        });
    });
});