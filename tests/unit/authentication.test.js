// Importing the jsonwebtoken library
const jwt = require('jsonwebtoken');

const checkAuth = require('../../middleware/check-auth');

require('dotenv').config();


describe('Auth Middleware', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            headers: {
                authorization: ''
            }
        };

        res = {
            status: jest.fn(() => res),
            json: jest.fn(() => res)
        };

        next = jest.fn();

        process.env.JWT_KEY = 'V3ryC0mpl3xAndL0ngS3cr3tT3stK3yTh4t1sK3ptS3cr3t'; 
    });

    test('should return an error message for an invalid token', async () => {
        req.headers.authorization = 'Bearer invalidtoken';

        await checkAuth(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);

        expect(res.json).toHaveBeenCalledWith({
            msg: 'No access token provided'
        });

        expect(next).not.toHaveBeenCalled();
    });

    test('should return an error message for an expired token', async () => {
        const expiredToken = jwt.sign({ userId: '1' }, 'V3ryC0mpl3xAndL0ngS3cr3tT3stK3yTh4t1sK3ptS3cr3t', { expiresIn: '-1s' });

        req.headers.authorization = `Bearer ${expiredToken}`;

        await checkAuth(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);

        expect(res.json).toHaveBeenCalledWith({
            msg: 'Your token has expired. Please login again.'
        });

        expect(next).not.toHaveBeenCalled();
    });

    test('should return an error message for missing authentication token', async () => {
        await checkAuth(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);

        expect(res.json).toHaveBeenCalledWith({
            msg: 'No access token provided'
        });

        expect(next).not.toHaveBeenCalled();
    });

    test('should pass control to the next middleware for a valid token and pass user data', async () => {
        const userData = {
            userId: '1',
            tipo: 'paciente'
        };
        const token = jwt.sign(userData, 'V3ryC0mpl3xAndL0ngS3cr3tT3stK3yTh4t1sK3ptS3cr3t', { expiresIn: '2m' });

        req.headers.authorization = `Bearer ${token}`;

        await checkAuth(req, res, next);

        expect(next).toHaveBeenCalled();

        expect(res.status).not.toHaveBeenCalled();

        expect(res.json).not.toHaveBeenCalled();

        expect(req.userData).toEqual(expect.objectContaining({
            userId: userData.userId,
            tipo: userData.tipo
        }));
    });
});