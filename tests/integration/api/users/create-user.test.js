const { createMedico, createPaciente } = require("../../../../controllers/utilizadores.controller");
const Utilizador = require("../../../../models/utilizadores.model");
const bcrypt = require("bcrypt");

jest.mock("../../../../models/utilizadores.model");
jest.mock("bcrypt");

describe("Create users", () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            body: {}
        };

        res = {
            status: jest.fn(() => res),
            json: jest.fn(() => res)
        };
    });

    describe("createMedico", () => {
        test("should return an error message for missing fields", async () => {
            await createMedico(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({message: "Todos os campos são obrigatórios"});
        });

        test("should return an error message for an existing médico", async () => {
            req.body = {
                "nome": "Rui",
                "cedula": 5621,
                "email": "40220203@esmad.ipp.pt",
                "password": "Ruiburro1!",
                "tipo": "Médico",
                "imagem": "bbb",
                "genero": "Masculino",
                "especialidade": "Pediatria"
            };
    
            Utilizador.findOne.mockResolvedValue(req.body);
    
            await createMedico(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "Médico já existe" });
        });

        test("should create a new medico", async () => {
            req.body = {
                "nome": "Test",
                "cedula": "123",
                "email": "test@test.com",
                "password": "password",
                "tipo": "Médico",
                "imagem": "image.jpg",
                "genero": "Masculino",
                "especialidade": "Cardiologia"
            };
    
            Utilizador.findOne.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue("hashedpassword");
    
            await createMedico(req, res);
    
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: "Médico criado. Por favor confirme o seu email"
            }));
        });

        test("should return an error message for unexisting especialidade", async () => {
            req.body = {
                "nome": "Test",
                "cedula": "123",
                "email": "test@test.com",
                "password": "password",
                "tipo": "Médico",
                "imagem": "image.jpg",
                "genero": "Masculino",
                "especialidade": "error"
            };
        
            await createMedico(req, res);
        
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false, 
                message: `Especialidade ${req.body.especialidade} doesn"t exist.`
            });
        });
    });
});

describe("createPaciente", () => {
    test("should return an error message for missing fields", async () => {
        await createPaciente(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: "Todos os campos são obrigatórios"});
    });

    test("should return an error message for an existing paciente", async () => {
        req.body = {
            "nome": "Pedro",
            "n_utente": "123456789",
            "email": "zacksanford27@gmail.com",
            "password": "Pedroburro1!",
            "data_nascimento": "2004-02-02",
            "contacto": "916933679",
            "cod_postal": "4435-121",
            "genero": "Masculino",
            "sistema_saude": "ADSE"
        };
    
        Utilizador.findOne.mockResolvedValue(req.body);
    
        await createPaciente(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Paciente já existe" });
    });

    test("should create a new paciente", async () => {
        req.body = {
            "nome": "Test",
            "n_utente": "123",
            "email": "test@test.com",
            "password": "password",
            "data_nascimento": "2000-01-01",
            "contacto": "123456789",
            "cod_postal": "1234-567",
            "genero": "Masculino",
            "sistema_saude": "ADSE"
        };

        Utilizador.findOne.mockResolvedValue(null);
        bcrypt.hash.mockResolvedValue("hashedpassword");

        await createPaciente(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: "Paciente criado. Por favor confirme o seu email"
        }));
    });

    test("should return an error message for invalid sistema de saúde", async () => {
        req.body = {
            "nome": "Test",
            "n_utente": "123",
            "email": "test@test.com",
            "password": "password",
            "data_nascimento": "2000-01-01",
            "contacto": "123456789",
            "cod_postal": "1234-567",
            "genero": "Masculino",
            "sistema_saude": "adasdsads"
        };
    
        await createPaciente(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: "Sistema de saúde inválido" });
    });
});
