const { PassThrough } = require("nodemailer/lib/xoauth2");
const { resetPassword } = require("../../../../controllers/utilizadores.controller");
const Utilizador = require("../../../../models/utilizadores.model");
const bcrypt = require("bcrypt");

jest.mock("../../../../models/utilizadores.model");
jest.mock("bcrypt");

describe('Reset password', () => {
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

    test('should return a 200 status and a success message if the email is successfully sent', async () => {
        req.body = {
            password: 'password1',
            confirmPassword: 'password1',
        }
        userCodes.destroy.mockResolvedValue(1);
        sendVerificationEmail.mockResolvedValue(true);

        await resetPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            msg: 'Password sucessfully reset'
        });
    });

    test('should return a 400 status if the password token record is not found or has already been used', async () => {
        req.body = {
            password: 'password1',
            confirmPassword: 'password1'
        };
        userTokens.findOne.mockResolvedValue(null);

        await resetPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            msg: "Password token record not found or has already been used."
        });
    });

    test('should return a 400 status if the passwords do not match', async () => {
        req.body = {
            password: 'password1',
            confirmPassword: 'password2'
        };

        await resetPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'Passwords do not match'
        });
    });
});