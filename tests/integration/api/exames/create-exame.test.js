const { create } = require('../../../../controllers/especialidade.controller');
const Exame = require('../../../../models/exames.model');

jest.mock('../../../../models/exames.model');

describe('Create exams', () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            body: {},
            headers: {
                Authorizaton: 'Bearer valid_token'
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

    test("should create a new exame", async () => {
        req.body = {
            "data": "2024-05-26",
            "hora": "19:00",
            "id_consulta": 16,
            "especialidade": "Pediatria",
            "nome_exame": "Hemograma"
        };

        await create(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: "Exame criado com sucesso"
        }));
    });

    test("should return an error message for missing fields", async () => {
        await create(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: "Todos os campos são obrigatórios"});
    });

    test("should return an error message for unexisting especialidade", async () => {
        req.body = {
            "data": "2024-05-26",
            "hora": "19:00",
            "id_consulta": 16,
            "especialidade": "error",
            "nome_exame": "Hemograma"
        };
    
        await create(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false, 
            message: `Especialidade ${req.body.especialidade} doesn"t exist.`
        });
    });

    test("should return an error message for an existing exame", async () => {
        req.body = {
            "data": "2024-05-26",
            "hora": "19:00",
            "id_consulta": 16,
            "especialidade": "Cardiologia",
            "nome_exame": "Ecocardiograma"
        };
    
        Exame.findOne.mockResolvedValue(req.body);
    
        await create(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Exame já existe" });
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
        req.params.user_id = '2';

        await create(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'You are not authorized to perform this action'
        });
    });
});