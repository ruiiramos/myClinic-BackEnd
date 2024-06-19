const jwt = require('jsonwebtoken');

const checkAdmin = require('../../middleware/check-admin');

require('dotenv').config();

describe('Admin Middleware', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            userData: {
                type: ''
            }
        };

        res = {
            status: jest.fn(() => res), 
            json: jest.fn(() => res) 
        };

        next = jest.fn();
    });

    test('should return an error message for a non-admin user', () => {
        req.userData.tipo = 'paciente';

        checkAdmin(req, res, next);

        expect(next).not.toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledWith(403);

        expect(res.json).toHaveBeenCalledWith({
            msg: 'Only administrators can perfom this action'
        });
    });

    test('should not return an error message for an admin user', () => {
        req.userData.tipo = 'admin';

        checkAdmin(req, res, next);

        expect(next).toHaveBeenCalled();

        expect(res.status).not.toHaveBeenCalled();

        expect(res.json).not.toHaveBeenCalled();

    });

});