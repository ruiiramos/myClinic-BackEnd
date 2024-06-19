const { create } = require('../../../../controllers/especialidade.controller');
const Especialidade = require('../../../../models/especialidade.model');
const jwt = require('jsonwebtoken')

jest.mock('../../../../models/especialidade.model');
jest.mock('jsonwebtoken');

describe('Create especialidade', () => {
    let req;
    let res;
    
    beforeEach(() => {
        req = {
            body: {},
            headers: {
                authorization: 'Bearer valid_token'
            },
            userData: {
                user_id: 1,
                tipo: 'admin'
            },
            params: {
                user_id: '1'
            }
        };
    
        res = {
            status: jest.fn(() => res),
            json: jest.fn(() => res)
        };

        jwt.verify.mockReturnValue(req.userData);
    });

    test('should create a new especialidade', async () => {
        req.body = {
            "especialidade": "Psicologia"
        };
    
        Especialidade.findOne.mockResolvedValue(null);
        Especialidade.create.mockResolvedValue(req.body);
    
        await create(req, res);
    
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: "Especialidade criada com sucesso",
            data: req.body
        });
    });
    
    test('should return an error message for missing field', async () => {
        await create(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "O campo especialidade é obrigatório" });
    });
    
    test('should return an error message for an existing especialidade', async () => {
        req.body = {
            "especialidade": "Cardiologia"
        };
    
        Especialidade.findOne.mockResolvedValue(req.body);
    
        await create(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Especialidade já existe" });
    });

    test('should return a 401 status if no token is provided', async () => {
        req.headers.authorization = '';

        await create(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'No access token provided'
        });
    });

    test('should return a 401 status if the token is expired', async () => {
        jwt.verify.mockImplementation(() => {
            throw new jwt.TokenExpiredError();
        });

        await create(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'Your token has expired. Please login again.'
        });
    });

    test('should return a 403 status if the user is not an admin', async () => {
        req.userData.tipo = 'user';

        await create(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'Only administrators can perfom this action'
        });
    });
});