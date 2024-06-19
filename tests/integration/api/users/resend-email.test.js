const { resendEmail } = require("../../../../controllers/utilizadores.controller");
const userCodes = require("../../../../models/userCodes.model");
const { sendVerificationEmail } = require("../../../../controllers/utilizadores.controller");
const bcrypt = require("bcrypt");

jest.mock("../../../../models/userCodes.model");
jest.mock("bcrypt");

describe('Resend email', () => {
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

    test('should return a 200 status and a success message if the email is successfully sent', async () => {
        req.body = {
            id_user: 1,
            email: '40220203@esmad.ipp.pt'
        }
        userCodes.destroy.mockResolvedValue(1);
        sendVerificationEmail.mockImplementation(async (id_user, email, res) => true);

        await resendEmail(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            msg: 'Verification email sent.'
        });
    });
});