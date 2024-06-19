const { findAll, findOne } = require('../../../../controllers/consultas.controller');
const Consulta = require('../../../../models/consultas.model');
const jwt = require('jsonwebtoken');

jest.mock('../../../../models/consultas.model');
jest.mock('jsonwebtoken');

describe('GET Consultas', () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            body: {},
            headers: {
                authorization: 'Bearer valid_token'
            },
            userData: {
                user_id: 1
            },
            params: {
                id: '1'
            }
        };

        res = {
            status: jest.fn(() => res),
            json: jest.fn(() => res)
        };

        jwt.verify.mockReturnValue(req.userData);
    });

    describe('findAll', () => {
        test('should return all consultas', async () => {
            const consultas = [{ id: 1 }, { id: 2 }];
            Consulta.findAll.mockResolvedValue(consultas);

            await findAll(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: consultas
            });
        });

        test('should return a 401 status if no token is provided', async () => {
            req.headers.authorization = '';

            await findAll(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                msg: 'No access token provided'
            });
        });

        test('should return a 401 status if the token is expired', async () => {
            jwt.verify.mockImplementation(() => {
                throw new jwt.TokenExpiredError();
            });

            await findAll(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                msg: 'Your token has expired. Please login again.'
            });
        });

    });

    describe('findOne', () => {
        
        test('should return the consulta with the given id', async () => {
            const consulta = { id: 1 };
            Consulta.findByPk.mockResolvedValue(consulta);

            await findOne(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: consulta
            });
        });

        test('should return a 404 status if no consulta is found with the given id', async () => {
            Consulta.findByPk.mockResolvedValue(null);

            await findOne(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Consulta não encontrada.'
            });
        });
        test('should return a 401 status if no token is provided', async () => {
            req.headers.authorization = '';

            await findOne(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                msg: 'No access token provided'
            });
        });

        test('should return a 401 status if the token is expired', async () => {
            jwt.verify.mockImplementation(() => {
                throw new jwt.TokenExpiredError();
            });

            await findOne(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                msg: 'Your token has expired. Please login again.'
            });
        });

    });
});