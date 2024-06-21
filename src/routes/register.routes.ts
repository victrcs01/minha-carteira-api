import { Request, Response } from 'express';
import { AbstractRoute } from "./abstract.routes";
import { RegisterController } from "../controllers/register.controller";

export class RegisterRoutes extends AbstractRoute {

    private static controller = new RegisterController;

    constructor() {
        super();
        this.router.post("/newUser", (req: Request, res: Response) => RegisterRoutes.controller.createNewUser(req, res));
        this.router.post("/", (req: Request, res: Response) => RegisterRoutes.controller.authenticateUser(req, res));
    }
}

