const { findAll, findOne } = require('../../../../controllers/analises.controller');
const Analise = require('../../../../models/analises.model');
const jwt = require('jsonwebtoken');

jest.mock('../../../../models/analises.model');
jest.mock('jsonwebtoken');

describe('GET Análises', () => {
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
        test('should return all analises', async () => {
            const analises = [{ id: 1 }, { id: 2 }];
            Analise.findAll.mockResolvedValue(analises);

            await findAll(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: analises
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

        test('should return the analise with the given id', async () => {
            const analise = { id: 1 };
            Analise.findByPk.mockResolvedValue(analise);

            await findOne(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: analise
            });
        });

        test('should return a 404 status if no analise is found with the given id', async () => {
            Analise.findByPk.mockResolvedValue(null);

            await findOne(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Análise não encontrada.'
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