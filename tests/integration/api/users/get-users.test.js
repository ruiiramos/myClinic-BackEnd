const { findAllMedicos, findAllPacientes, findCurrent, findOneMedico, findOnePaciente, findMedicosByEspecialidade } = require('../../../../controllers/utilizadores.controller');
const Utilizador = require('../../../../models/utilizadores.model');
const Genero = require('../../../../models/genero.model');
const Especialidade = require('../../../../models/especialidade.model');
const sistSaude = require('../../../../models/sistSaude.model');
const jwt = require('jsonwebtoken');

jest.mock('../../../../models/utilizadores.model');
jest.mock('../../../../models/genero.model');
jest.mock('../../../../models/especialidade.model');
jest.mock('../../../../models/sistSaude.model');
jest.mock('jsonwebtoken');

describe('Utilizadores Controller', () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            body: {},
            headers: {
                authorization: 'Bearer valid_token'
            },
            userData: {
                userId: 1
            },
            params: {
                id: '1'
            },
            query: {
                especialidade: 'Cardiologia'
            }
        };

        res = {
            status: jest.fn(() => res),
            json: jest.fn(() => res)
        };

        jwt.verify.mockReturnValue(req.userData);
    });

    describe('findAllMedicos', () => {
        test('should return all medicos', async () => {
            const medicos = [{ id: 1 }, { id: 2 }];
            Utilizador.findAll.mockResolvedValue(medicos);

            await findAllMedicos(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: medicos
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

    describe('findAllPacientes', () => {
        test('should return all pacientes', async () => {
            const pacientes = [{ id: 1 }, { id: 2 }];
            Utilizador.findAll.mockResolvedValue(pacientes);

            await findAllPacientes(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: pacientes
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

    describe('findCurrent', () => {
        test('should return the current user', async () => {
            const user = { id: 1 };
            Utilizador.findByPk.mockResolvedValue(user);

            await findCurrent(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: user,
                links: [
                    { "rel": "self", "href": `/users/${req.userData.userId}`, "method": "GET" },
                    { "rel": "delete", "href": `/users/${req.userData.userId}`, "method": "DELETE" },
                    { "rel": "modify", "href": `/users/${req.userData.userId}`, "method": "PATCH" },
                ]
            });
        });

        test('should return a 404 status if no user is found with the given id', async () => {
            Utilizador.findByPk.mockResolvedValue(null);
    
            await findCurrent(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                msg: `User with ID ${req.userData.userId} not found.`
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

    describe('findOneMedico', () => {
        test('should return the medico with the given id', async () => {
            const medico = { id: 1 };
            Utilizador.findByPk.mockResolvedValue(medico);

            await findOneMedico(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: medico,
                links: [
                    { "rel": "self", "href": `/medicos/${req.params.id}`, "method": "GET" },
                    { "rel": "delete", "href": `/medicos/${req.params.id}`, "method": "DELETE" },
                    { "rel": "modify", "href": `/medicos/${req.params.id}`, "method": "PATCH" },
                ]
            });
        });

        test('should return a 404 status if no medico is found with the given id', async () => {
            Utilizador.findByPk.mockResolvedValue(null);
    
            await findOneMedico(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: `Médico with ID ${req.params.id} not found.`
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

    describe('findOnePaciente', () => {
        test('should return the paciente with the given id', async () => {
            const paciente = { id: 1 };
            Utilizador.findByPk.mockResolvedValue(paciente);

            await findOnePaciente(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: paciente
            });
        });

        test('should return a 404 status if no medico is found with the given id', async () => {
            Utilizador.findByPk.mockResolvedValue(null);
    
            await findOnePaciente(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: `Paciente with ID ${req.params.id} not found.`
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

    describe('findMedicosByEspecialidade', () => {
        test('should return medicos with the given especialidade', async () => {
            const medicos = [{ id: 1 }, { id: 2 }];
            Utilizador.findAll.mockResolvedValue(medicos);
            Especialidade.findByPk.mockResolvedValue({ id: 1 });

            await findMedicosByEspecialidade(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: medicos
            });
        });

        test('should return a 404 status if no especialidade is found with the given id', async () => {
            Especialidade.findByPk.mockResolvedValue(null);
    
            await findMedicosByEspecialidade(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Especialidade not found"
            });
        });
    
        test('should return a 404 status if no medicos are found with the given especialidade', async () => {
            const especialidade = { id: 1 };
            Especialidade.findByPk.mockResolvedValue(especialidade);
            Utilizador.findAll.mockResolvedValue([]);
    
            await findMedicosByEspecialidade(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Especialidade not in practice"
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
});