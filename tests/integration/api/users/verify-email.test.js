const { verifyEmail } = require("../../../../controllers/utilizadores.controller");
const userCodes = require("../../../../models/userCodes.model");
const bcrypt = require("bcrypt");

jest.mock("../../../../models/utilizadores.model");
jest.mock("bcrypt");

describe('Verify email', () => {
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

    describe('verifyEmail', () => {
        test('should return a 400 status if no user ID or code is provided', async () => {
            req.body = {
                id_user: 1,
            };
    
            await verifyEmail(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                msg: "User ID is required. Please provide a valid user ID."
            });
    
            req.body = { id_user: 1 };
    
            await verifyEmail(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                msg: "Code is required. Please provide a valid código."
            });
        });
    
        test('should return a 400 status if the code is invalid', async () => {
            req.body = {
                id_user: 1,
                codigo: '09876543'
            };
            bcrypt.compare.mockResolvedValue(false);
    
            await verifyEmail(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                msg: "Invalid code. Please try again."
            });
        });

        test('should return a 400 status if the account record does not exist or has been verified already', async () => {
            req.body = {
                id_user: 1,
                codigo: '123456'
            };
            userCodes.findOne.mockResolvedValue(null);
    
            await verifyEmail(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                msg: "Account record doesn't exist or has been verified already."
            });
        });
    
        test('should return a 200 status and a success message if the email is successfully verified', async () => {
            req.body = {
                id_user: 99,
                codigo: '123456'
            };
            bcrypt.compare.mockResolvedValue(true);
            Utilizador.update.mockResolvedValue([1]);
            userCodes.destroy.mockResolvedValue(1);
    
            await verifyEmail(req, res);
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                msg: "User's email successfully verified",
                links: [
                    { "rel": "self", "href": `/user/${req.body.id_user}`, "method": "GET" },
                    { "rel": "delete", "href": `/user/${req.body.id_user}`, "method": "DELETE" },
                    { "rel": "modify", "href": `/user/${req.body.id_user}`, "method": "PATCH" },
                ]
            });
        });
    });
});