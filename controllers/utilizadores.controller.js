const db = require("../models/index.js")
const Utilizador = db.utilizador;
const Consulta = db.consulta;
const Especialidade = db.especialidade;
const Genero = db.genero
const sistSaude = db.sistema_de_saude
const userCodes = db.user_codes
const userTokens = db.user_tokens
const codPostal = db.codigo_postal

//"Op" necessary for LIKE operator
const { Op, ValidationError } = require('sequelize');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
})

exports.findAllMedicos = async (req, res) => {
    try {
        let medicos = await Utilizador.findAll({
            where: { tipo: 'medico' },
            attributes: ['id_user','nome', 'email', 'cedula', 'imagem'],
            include: [
                {
                    model: Genero,
                    attributes: ['genero'],
                },
                {
                    model: Especialidade,
                    attributes: ['especialidade'],
                },
            ]
        }) 
        
        res.status(200).json({ 
            success: true, 
            data: medicos
        });
    }
    catch (err) {
        if (err instanceof ValidationError) {
            return res.status(400).json({ success: false, message: err.message || 'Erro de validação ao procurar os médicos.', error: err.message });
        } else {
            res.status(500).json({
                success: false, msg: err.message || "Ocorreu um erro ao procurar os médicos."
            })
        }
    }
};

exports.findAllPacientes = async (req, res) => {
    try {
        let pacientes = await Utilizador.findAll({
            where: { tipo: 'paciente' },
            attributes: ['nome', 'email', 'data_nascimento', 'n_utente', 'contacto', 'imagem', 'cod_postal'],
            include: [
                {
                    model: Genero,
                    attributes: ['genero'],
                },
                {
                    model: sistSaude,
                    attributes: ['sistema_saude'],
                }
            ]
        }) 
        
        res.status(200).json({ 
            success: true, 
            data: pacientes
        });
    }
    catch (err) {
        if (err instanceof ValidationError) {
            return res.status(400).json({ success: false, message: err.message || 'Erro de validação ao procurar os pacientes.', error: err.message });
        } else {
            res.status(500).json({
                success: false, msg: err.message || "Ocorreu um erro ao procurar os pacientes."
            })
        }
    }
};

exports.findCurrent = async (req, res) => {
    try {
        const userId = req.userData.userId;
        console.log(`User ID: ${userId}`);

        let user = await Utilizador.findByPk(userId, {
            attributes: { exclude: ['id_genero', 'id_sistema_saude', 'id_especialidade'] },
            include: [
                {
                    model: Genero,
                    attributes: ['genero'],
                },
                {
                    model: Especialidade,
                    as: 'especialidade',
                    attributes: ['especialidade'],
                },
                {
                    model: sistSaude,
                    attributes: ['sistema_saude'],
                }
            ]
        });
        console.log(`User: ${JSON.stringify(user)}`);

        if (!user) {
            return res.status(404).json({
                success: false, 
                msg: `User with ID ${userId} not found.`
            });
        }

        res.status(200).json({ 
            success: true, 
            data: user,
            links:[
                { "rel": "self", "href": `/users/${userId}`, "method": "GET" },
                { "rel": "delete", "href": `/users/${userId}`, "method": "DELETE" },
                { "rel": "modify", "href": `/users/${userId}`, "method": "PATCH" },
            ]
        });

    }
    catch (err) {
        return res.status(500).json({ 
            success: false, 
            msg: `Error retrieving user with ID ${userId}.`
        });
        
    };
};

exports.findOneMedico = async (req, res) => {
    const id_user = req.params.id;
    try {
        let medico = await Utilizador.findByPk(id_user, {
            where: { tipo: 'medico' },
            attributes: ['nome', 'email', 'cedula', 'password', 'imagem'],
            include: [
                {
                    model: Genero,
                    attributes: ['genero'],
                },
                {
                    model: Especialidade,
                    as: 'especialidade',
                    attributes: ['especialidade'],
                },
            ]
        });

        if (!medico) {
            return res.status(404).json({
                success: false, 
                message: `Médico with ID ${id_user} not found.`
            });
        }

        res.status(200).json({ 
            success: true, 
            data: medico,
            links:[
                { "rel": "self", "href": `/medicos/${id_user}`, "method": "GET" },
                { "rel": "delete", "href": `/medicos/${id_user}`, "method": "DELETE" },
                { "rel": "modify", "href": `/medicos/${id_user}`, "method": "PATCH" },
            ]
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false, 
            message: `Error retrieving médico with ID ${id_user}.`
        });
    }
};

exports.findOnePaciente = async (req, res) => {
    const id_user = req.params.id;
    try {
        let paciente = await Utilizador.findByPk(id_user, {
            where: { tipo: 'paciente' },
            attributes: ['nome', 'email', 'data_nascimento', 'n_utente', 'contacto', 'imagem', 'cod_postal'],
            include: [
                {
                    model: Genero,
                    attributes: ['genero'],
                },
                {
                    model: sistSaude,
                    attributes: ['sistema_saude'],
                }
            ]
        });

        if (!paciente) {
            return res.status(404).json({
                success: false, 
                message: `Paciente with ID ${id_user} not found.`
            });
        }

        res.status(200).json({ 
            success: true, 
            data: paciente,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false, 
            message: `Error retrieving paciente with ID ${id_user}.`
        });
    }
};

exports.findMedicosByEspecialidade = async (req, res) => {
    try {
        const especialidade = req.query.especialidade;
        const especialidadeMap = { 'Cardiologia': 1, 'Dermatologia': 2, 'Pediatria': 3, 'Endocrinologia': 4, 'Estomatologia': 5, 'Gastrenterologia': 6, 'Ginecologia': 7, 'Hematologia': 8, 'Medicina Geral': 9, 'Nefrologia': 10, 'Neurologia': 11, 'Oftalmologia': 12, 'Ortopedia': 13, 'Otorrinolaringologia': 14, 'Psiquiatria': 15, 'Radiologia': 16, 'Reumatologia': 17, 'Urologia': 18 };
        const id_especialidade = especialidadeMap[especialidade];

        const existingEspecialidade = await Especialidade.findByPk(id_especialidade);
        if (!existingEspecialidade) {
            return res.status(404).json({
                success: false,
                message: "Especialidade not found"
            });
        }

        const medicos = await Utilizador.findAll({
            where: {
                id_especialidade: id_especialidade,
                tipo: 'medico'
            },
            attributes: ['id_user', 'nome']
        });

        if (medicos.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Especialidade not in practice"
            });
        }

        res.status(200).json({ 
            success: true, 
            data: medicos,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: err.message || "Some error occurred while retrieving medicos."
        });
    }
};

exports.createMedico = async (req, res) => {
    try {
        const { nome, cedula, email, password, tipo, imagem, genero, especialidade } = req.body;

        const generoMap = { 'Masculino': 1, 'Feminino': 2 };
        const especialidadeMap = { 'Cardiologia': 1, 'Dermatologia': 2, 'Pediatria': 3, 'Endocrinologia': 4, 'Estomatologia': 5, 'Gastrenterologia': 6, 'Ginecologia': 7, 'Hematologia': 8, 'Medicina Geral': 9, 'Nefrologia': 10, 'Neurologia': 11, 'Oftalmologia': 12, 'Ortopedia': 13, 'Otorrinolaringologia': 14, 'Psiquiatria': 15, 'Radiologia': 16, 'Reumatologia': 17, 'Urologia': 18 };
        const id_especialidade = especialidadeMap[especialidade];
        const id_genero = generoMap[genero];

        if (tipo === 'Médico') {
            if (!nome || !cedula || !email || !password || !imagem || !id_genero || !especialidade)
                return res.status(400).json({message: "Todos os campos são obrigatórios"})

            const medicoData = await Utilizador.findOne({ where: { cedula: cedula } });

            if (medicoData) {
                return res.status(400).json({
                    message: "Médico já existe"
                });
            }
        } else if (tipo === 'admin') {
            if (!nome || !email || !password)
                return res.status(400).json({message: "Todos os campos são obrigatórios"})
        } else {
            return res.status(400).json({message: "Tipo inválido"})
        }

        if (tipo === 'Médico' && (!id_especialidade || !especialidade)) {
            return res.status(400).json({
                success: false, message: `Especialidade with ID ${id_especialidade} doesn't exist.`
            });
        } else {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const newUser = {
                        cedula: cedula,
                        password: hash,
                        nome: nome,
                        email: email,
                        tipo: tipo,
                        id_genero: id_genero,
                        imagem: imagem,
                        id_especialidade: id_especialidade
                    };
                    Utilizador.create(newUser)
                        .then(result => {
                            sendVerificationEmail(result.id_user, result.email, res);
                            res.status(201).json({
                                message: `${tipo} criado. Por favor confirme o seu email.`,
                                id_user: result.id_user
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
                }
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || 'Ocorreu um erro ao criar o médico.',
            error: err.message
        });
    }
};      

exports.createPaciente = async (req, res) => {
    try {
        const { nome, n_utente, email, password, data_nascimento, contacto, cod_postal, genero, sistema_saude } = req.body;

        const generoMap = { 'Masculino': 1, 'Feminino': 2 };
        const sistemaSaudeMap = { 'ADSE': 1, 'Medicare': 2, 'Fidelidade': 3, 'Cofidis': 4, 'Médis': 5, 'Ageas': 6, 'Multicare': 7, 'AdvanceCare': 8 };
        const id_genero = generoMap[genero];
        const id_sistema_saude = sistemaSaudeMap[sistema_saude];

        if (!nome || !n_utente || !email || !password || !data_nascimento || !contacto || !cod_postal || !id_genero) {
            return res.status(400).json({message: "Todos os campos são obrigatórios"});
        }

        const pacienteData = await Utilizador.findOne({ where: { n_utente: n_utente } });

        let codigoPostalData = await codPostal.findOne({ where: { cod_postal: cod_postal } });
        if (!codigoPostalData) {
            codigoPostalData = await codPostal.create({ cod_postal: cod_postal });
        }

        if (pacienteData) {
            return res.status(400).json({ message: "Paciente já existe" });
        } else if (!sistema_saude || !id_sistema_saude) {
            return res.status(400).json({ success: false, message: "Sistema de saúde inválido" });
        } else {
            bcrypt.hash(password, 10, async (err, hash) => {
                if (err) {
                    return res.status(500).json({ error: err });
                } else {
                    const newPaciente = {
                        nome: nome,
                        n_utente: n_utente,
                        email: email,
                        password: hash,
                        tipo: 'paciente',
                        data_nascimento: data_nascimento,
                        contacto: contacto,
                        cod_postal: cod_postal,
                        id_genero: id_genero,
                        id_sistema_saude: id_sistema_saude,
                    };
                    try {
                        const result = await Utilizador.create(newPaciente);
                        await sendVerificationEmail(result.id_user, email, res);
                        res.status(201).json({
                            message: "Paciente criado. Por favor confirme o seu email",
                            id_user: result.id_user
                        });
                    } catch (err) {
                        console.log(err);
                        res.status(500).json({ error: err.message });
                    }
                }
            });
        }
    } catch (err) {
        console.error('Error creating paciente:', err);
        res.status(500).json({
            success: false,
            message: err.message || 'Ocorreu um erro ao criar o paciente.',
            error: err.message
        });
    }
};

exports.loginMedicos = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    Utilizador.findOne({ where: { email: email } })
        .then(utilizador => {
            if (!utilizador || utilizador.tipo !== 'medico') {
                return res.status(401).json({
                    message: "Médico não encontrado"
                });
            }

            bcrypt.compare(password, utilizador.password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Password inválida"
                    });
                }

                if (result) {
                    console.log(utilizador);
                    const token = jwt.sign(
                        {
                            email: utilizador.email,
                            userId: utilizador._id,
                            tipo: utilizador.tipo
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        }
                    );

                    return res.status(200).json({
                        message: "Authentication successful",
                        token: token
                    });
                }

                res.status(401).json({
                    message: "Authentication failed"
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.loginPacientes = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    Utilizador.findOne({ where: { email: email } })
        .then(utilizador => {
            if (!utilizador || (utilizador.tipo !== 'paciente' && utilizador.tipo !== 'admin')) {
                return res.status(401).json({
                    message: "Paciente não encontrado"
                });
            }

            bcrypt.compare(password, utilizador.password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Password inválida"
                    });
                }

                if (result) {
                    const token = jwt.sign(
                        {
                            email: utilizador.email,
                            userId: utilizador.dataValues.id_user,
                            tipo: utilizador.tipo
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        }
                    );

                    return res.status(200).json({
                        message: "Authentication successful",
                        token: token,
                        nome: utilizador.nome,
                        tipo: utilizador.tipo
                    });
                }

                res.status(401).json({
                    message: "Authentication failed"
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.updateMedicos = async (req, res) => {
    let medico;
    try {
        medico = await Utilizador.findByPk(req.params.id);

        if (!medico) {
            return res.status(404).json({
                success: false, msg: `Médico with ID ${req.params.id} not found.`
            });
        }

        let affectedRows = await medico.update(req.body);

        if(affectedRows[0] === 0){
            return res.status(200).json({
                success: true, 
                msg: `No updates were made to médico with ID ${req.params.id}.`
            });
        }

        return res.json({
            success: true,
            msg: `Médico with ID ${req.params.id} was updated successfully.`
        });
    }
    catch (err) {
        if (err instanceof ValidationError)
            return res.status(400).json({ 
                success: false, 
                msg: err.errors.map(e => e.message) 
            });

        res.status(500).json({
            success: false, 
            msg: `Error retrieving médico with ID ${req.params.id}.`
        });
    };
};

exports.updatePacientes = async (req, res) => {
    let paciente;
    try {
        paciente = await Utilizador.findByPk(req.params.id);

        const generoMap = { 'Masculino': 1, 'Feminino': 2 };
        const sistemaSaudeMap = { 'ADSE': 1, 'Medicare': 2, 'Fidelidade': 3, 'Cofidis': 4, 'Médis': 5, 'Ageas': 6, 'Multicare': 7, 'AdvanceCare': 8 };

        if (!paciente) {
            return res.status(404).json({
                success: false, msg: `Paciente with ID ${req.params.id} not found.`
            });
        }

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        if (req.body.genero) {
            req.body.id_genero = generoMap[req.body.genero];
        }

        if (req.body.sistema_saude) {
            req.body.id_sistema_saude = sistemaSaudeMap[req.body.sistema_saude];
        }

        let affectedRows = await paciente.update(req.body);

        if(affectedRows[0] === 0){
            return res.status(200).json({
                success: true, 
                msg: `No updates were made to paciente with ID ${req.params.id}.`
            });
        }

        return res.status(200).json({
            success: true,
            msg: `Paciente with ID ${req.params.id} was updated successfully.`
        });
    }
    catch (err) {
        if (err instanceof ValidationError)
            return res.status(400).json({ 
                success: false, 
                msg: err.errors.map(e => e.message) 
            });

        res.status(500).json({
            success: false, 
            msg: `Error retrieving paciente with ID ${req.params.id}.`
        });
    };
};

exports.deletePacientes = async (req, res) => {
    try {
        const paciente = await Utilizador.findByPk(req.params.id);

        if (!paciente) {
            return res.status(404).json({
                success: false, msg: `Paciente with ID ${req.params.id} not found.`
            });
        }

        const consultas = await Consulta.findOne({
            where: { 
                id_paciente: paciente.id_user
            }
        });

        if (consultas) {
            return res.status(400).json({
                success: false,
                msg: "Unable to delete the paciente because there are consultas associated with him."
            });
        }

        if (paciente.tipo !== 'paciente') {
            return res.status(400).json({
                success: false, msg: `Paciente with ID ${req.params.id} is not a paciente.`
            });
        }

        await paciente.destroy();

        return res.status(200).json({
            success: true, msg: `Paciente with ID ${req.params.id} has been deleted.`
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: err
        });
    }
};

exports.deleteMedicos = async (req, res) => {
    try {
        const medico = await Utilizador.findByPk(req.params.id);

        if (!medico) {
            return res.status(404).json({
                success: false, msg: `Médico with ID ${req.params.id} not found.`
            });
        }

        const consultas = await Consulta.findOne({
            where: { 
                id_medico: medico.id_user
            }
        });

        if (consultas) {
            return res.status(400).json({
                success: false,
                msg: "Unable to delete the medico because there are consultas associated with him."
            });
        }

        if (medico.tipo !== 'medico') {
            return res.status(400).json({
                success: false, msg: `Médico with ID ${req.params.id} is not a medico.`
            });
        }

        await medico.destroy();

        return res.status(200).json({
            success: true, msg: `Médico with ID ${req.params.id} has been deleted.`
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: err
        });
    }
};

const sendVerificationEmail = async (id_user, email, res) => {
    try {
        const code = `${Math.floor(100000 + Math.random() * 900000)}`;

        const emailTemplate = fs.readFileSync('./html/email_verification.html', 'utf8');

        const emailBody = emailTemplate.replace('{{code}}', code); 

        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: "Verify your account",
            html: emailBody
        };

        const hashedCode = await bcrypt.hash(code, 10);

        await userCodes.create({
            id_user: id_user,
            codigo: hashedCode,
        });

        await transporter.sendMail(mailOptions);

        return true
    } catch (err) {
        throw new Error(err.message || "Some error ocurred while sending the verification email");
    }
}

exports.verifyEmail = async (req, res) => {
    try {
        const { id_user, codigo } = req.body;

        if (!id_user) {
            return res.status(400).json({
                success: false,
                msg: "User ID is required. Please provide a valid user ID."
            });
        }

        if (!codigo) {
            return res.status(400).json({
                success: false,
                msg: "Code is required. Please provide a valid código."
            });
        }

        const codigoRecord = await userCodes.findOne({
            where: {
                id_user: id_user
            }
        });

        if (!codigoRecord) {
            return res.status(400).json({
                success: false,
                msg: "Account record doesn't exist or has been verified already."
            });
        }

        const isMatch = await bcrypt.compare(codigo, codigoRecord.codigo);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                msg: "Invalid code. Please try again."
            });
        } 

        await Utilizador.update({verified: true}, {
            where: {
                id_user: id_user
            }
        });

        await userCodes.destroy({
            where: {
                id_user: id_user
            }
        });

        res.status(200).json({
            success: true,
            msg: "User's email successfully verified",
            links: [
                { "rel": "self", "href": `/user/${id_user}`, "method": "GET" },
                { "rel": "delete", "href": `/user/${id_user}`, "method": "DELETE" },
                { "rel": "modify", "href": `/user/${id_user}`, "method": "PATCH" },
            ]
        });
    }
    catch (err) {
        return res.status(500).json({
                success: false, 
                msg: err.message || "Some error occurred while verifing the user's email."
            });
    };
};

exports.resendEmail = async (req, res) => {
    try {
        const { id_user, email } = req.body;

        await userCodes.destroy({
            where: {
                id_user: id_user
            }
        });

        const emailSent = await sendVerificationEmail(id_user, email);
        if (emailSent) {
            res.status(200).json({
                success: true,
                msg: 'Verification email sent.'
            });
        } else {
            throw new Error('Failed to send verification email.');
        }
    }
    catch (err) {
        return res.status(500).json({
                success: false, 
                msg: err.message || "Some error occurred while verifying the user's email."
            });
    };
};

exports.forgotPassword = async (req, res) => {
    try {
        const user = await Utilizador.findOne(
            { 
                where: { 
                    email: req.body.email 
                } 
            });

        if (!user) {
            return res.status(404).json({
                msg: 'The user was not found'
            });
        }

        const token = crypto.randomBytes(Math.ceil(128 / 2)).toString('hex').slice(0, 128);

        const resetUrl = `${req.protocol}://localhost:5173/resetpassword/${token}`

        const emailTemplate = fs.readFileSync('./html/email_forgot_password.html', 'utf8');

        const emailBody = emailTemplate.replace('{{resetUrl}}', resetUrl);  

        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: req.body.email,
            subject: "Reset your password",
            html: emailBody
        };

        await userTokens.destroy({
            where: {
                id_user: user.id_user
            }
        });

        await userTokens.create({
            id_user: user.id_user,
            token: token
        });

        try {
            await transporter.sendMail(mailOptions);
        } catch (err) {
            console.error('Error while sending email: ', err);
            throw new Error('Failed to send reset password email.');
        }

        res.status(200).json({
            success: true,
            msg: "Reset password email sent",
        });

        
    } catch (err) {
        console.error('Error in forgotPassword function:', err);
        res.status(500).json({
            error: err.msg || 'Some error occurred while sending the reset password email.'
        });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const {password, confirmPassword } = req.body;

        const passwordTokenRecord = await userTokens.findOne({
            where: {
                token: req.params.token
            }
        });

        if (!passwordTokenRecord) {
            return res.status(400).json({
                success: false,
                msg: "Password token record not found or has already been used."
            });
        }

        if (!(password === confirmPassword)) {
            return res.status(400).json({
                msg: 'Passwords do not match'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await Utilizador.update({password: hashedPassword}, {
            where: {
                id_user: passwordTokenRecord.id_user
            }
        });

        await userTokens.destroy({
            where: {
                id_user: passwordTokenRecord.id_user
            }
        });

        res.status(200).json({
            success: true,
            msg: "Password sucessfully reset",
        });
    }
    catch (err) {
        return res.status(500).json({
                success: false, 
                msg: err.message || "Some error occurred while reseting the password."
            });
    };
};