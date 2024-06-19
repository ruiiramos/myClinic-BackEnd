const { forgotPassword } = require("../../../../controllers/utilizadores.controller");
const Utilizador = require("../../../../models/utilizadores.model");
const userTokens = require("../../../../models/userTokens.model");
const crypto = require("crypto");

jest.mock("../../../../models/utilizadores.model");
jest.mock('../../../../models/userTokens.model');
jest.mock("crypto");

describe('Forgot password', () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            body: {},
        };

        res = {
            status: jest.fn(() => res),
            json: jest.fn(() => res)
        };
    });

    describe('forgotPassword', () => {
        test('should return a 404 status if no user is found with the given email', async () => {
            req.body = { email: 'test@test.com' };
            Utilizador.findOne.mockResolvedValue(null);
    
            await forgotPassword(req, res);
    
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                msg: 'The user was not found'
            });
        });

        test('should return a 200 status and a success message if the reset password email is successfully sent', async () => {
            Utilizador.findOne.mockResolvedValue({ id_user: 1 });
            userTokens.destroy.mockResolvedValue(1);
            userTokens.create.mockResolvedValue(true);
            crypto.randomBytes.mockReturnValue(Buffer.from('12345678901234567890123456789012', 'hex'));
    
            await forgotPassword(req, res);
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                msg: 'Reset password email sent'
            });
        });
    
    });
});