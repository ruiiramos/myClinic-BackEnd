const { authPlugins } = require('mysql2');
const { create } = require('../../../../controllers/analises.controller');
const Analise = require('../../../../models/analises.model');
const jwt = require('jsonwebtoken')

jest.mock('../../../../models/analises.model');

describe('Create análises', () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            body: {},
            headers: {
                Authorization: 'Bearer valid_token'
            },
            userData: {
                id_user: 1
            },
            params: {
                id_user: '1'
            }
        };

        res = {
            status: jest.fn(() => res),
            json: jest.fn(() => res)
        };

        jwt.verify.mockReturnValue(req.userData);
    });

    test('should create a new analise', async () => {
        req.body = {
            "resultado": "Tudo limpo",
            "preco_analise": "80.00",
            "data": "2024-05-26",
            "id_consulta": 16
        };
    
        await create(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: "Análise criada",
        });
    });
    
    test('should return an error message if there is an error during the creation of the analise', async () => {
        const error = new Error('Test error');
        Analise.create.mockRejectedValue(error);
    
        await create(req, res);
    
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: error.message
        });
    });
    
    test('should return a 400 status if a required field is missing', async () => {
        req.body = {
            resultado: 'Positive',
            preco_analise: 50,
            data: '2022-06-19'
        };
    
        await create(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "Todos os campos são obrigatórios"
        });
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

    test('should return a 403 status if the user is not authorized', async () => {
        req.params.id_user = '2';

        await create(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'You are not authorized to perform this action'
        });
    });
});

