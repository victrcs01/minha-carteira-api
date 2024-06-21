import { Request, Response } from 'express';
const AbstractRoute = require("./abstract.routes.ts");
const RegisterController = require("../controllers/register.controller.ts");

class RegisterRouter extends AbstractRoute {

    constructor() {
        super();
        this.router.post("/password", (req: Request, res: Response) => RegisterController.getUserInfo(req, res));
        //this.router.post("/token", authenticateToken, controller.authenticateToken);
    }
}

module.exports = new RegisterRouter();

