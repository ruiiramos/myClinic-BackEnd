const { findAll, findOne } = require('../../../../controllers/exames.controller');
const Exame = require('../../../../models/exames.model');
const jwt = require('jsonwebtoken');

jest.mock('../../../../models/exames.model');
jest.mock('jsonwebtoken');

describe('GET Exames', () => {
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
        test('should return all exames', async () => {
            const exames = [{ id: 1 }, { id: 2 }];
            Exame.findAll.mockResolvedValue(exames);

            await findAll(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: exames
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
        
        test('should return the exame with the given id', async () => {
            const exame = { id: 1 };
            Exame.findByPk.mockResolvedValue(exame);

            await findOne(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: exame
            });
        });

        test('should return a 404 status if no exame is found with the given id', async () => {
            Exame.findByPk.mockResolvedValue(null);

            await findOne(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Exame não encontrado.'
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