const { create } = require('../../../../controllers/consultas.controller');
const Exame = require('../../../../models/consultas.model');

jest.mock('../../../../models/consultas.model');

describe('Create consultas', () => {
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

    test('should create a new consulta', async () => {
        req.body = {
            "data": "2024-05-30",
            "hora": "19:00",
            "preco_consulta": 50,
            "nome_medico": "Rui",
            "nome_paciente": "Pedro"
        };
    
        const medico = { id_user: 1, nome: req.body.nome_medico, tipo: 'medico' };
        const paciente = { id_user: 2, nome: req.body.nome_paciente, tipo: 'paciente' };
    
        Utilizador.findOne.mockResolvedValueOnce(medico).mockResolvedValueOnce(paciente);
        Consulta.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
        Consulta.create.mockResolvedValue(req.body);
    
        await create(req, res);
    
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: "Consulta criada",
            data: req.body
        });
    });
    
    test('should return an error message for missing fields', async () => {
        await create(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Todos os campos são obrigatórios" });
    });

    test('should not create a consulta if the date is within 5 days of the current date', async () => {
        const currentDate = new Date();
        const consultaDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 4); // 4 days from now
    
        req.body = {
            "data": consultaDate.toISOString().split('T')[0],
            "hora": "19:00",
            "preco_consulta": 50,
            "nome_medico": "Dr. John",
            "nome_paciente": "Mr. Smith"
        };
    
        const medico = { id_user: 1, nome: req.body.nome_medico, tipo: 'medico' };
        const paciente = { id_user: 2, nome: req.body.nome_paciente, tipo: 'paciente' };
    
        Utilizador.findOne.mockResolvedValueOnce(medico).mockResolvedValueOnce(paciente);
        Consulta.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
        Consulta.create.mockResolvedValue(req.body);
    
        await create(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: "A data da consulta deve ser pelo menos 5 dias após a data atual"});
    });
    
    test('should return an error message for non-existing medico', async () => {
        req.body = {
            "data": "2024-05-26",
            "hora": "19:00",
            "preco_consulta": 50,
            "nome_medico": "Dr. John",
            "nome_paciente": "Pedro"
        };
    
        Utilizador.findOne.mockResolvedValueOnce(null);
    
        await create(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Médico não encontrado" });
    });
    
    test('should return an error message for non-existing paciente', async () => {
        req.body = {
            "data": "2024-05-26",
            "hora": "19:00",
            "preco_consulta": 50,
            "nome_medico": "Rui",
            "nome_paciente": "Mr. Smith"
        };
    
        const medico = { id_user: 1, nome: req.body.nome_medico, tipo: 'medico' };
    
        Utilizador.findOne.mockResolvedValueOnce(medico).mockResolvedValueOnce(null);
    
        await create(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Paciente não encontrado" });
    });
    
    test('should return an error message for existing consulta for medico', async () => {
        req.body = {
            "data": "2024-05-24",
            "hora": "09:00",
            "preco_consulta": 50,
            "nome_medico": "Rui",
            "nome_paciente": "Carolina"
        };
    
        const medico = { id_user: 1, nome: req.body.nome_medico, tipo: 'medico' };
        const paciente = { id_user: 2, nome: req.body.nome_paciente, tipo: 'paciente' };
    
        Utilizador.findOne.mockResolvedValueOnce(medico).mockResolvedValueOnce(paciente);
        Consulta.findOne.mockResolvedValueOnce(req.body);
    
        await create(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Consulta já existe para este médico na data e hora especificadas" });
    });
    
    test('should return an error message for existing consulta for paciente', async () => {
        req.body = {
            "data": "2024-05-26",
            "hora": "09:00",
            "preco_consulta": 50,
            "nome_medico": "Pedro",
            "nome_paciente": "Pedro"
        };
    
        const medico = { id_user: 1, nome: req.body.nome_medico, tipo: 'medico' };
        const paciente = { id_user: 2, nome: req.body.nome_paciente, tipo: 'paciente' };
    
        Utilizador.findOne.mockResolvedValueOnce(medico).mockResolvedValueOnce(paciente);
        Consulta.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(req.body);
    
        await create(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Consulta já existe para este paciente na data e hora especificadas" });
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
});
