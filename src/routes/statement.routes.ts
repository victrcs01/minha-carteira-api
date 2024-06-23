import { Request, Response } from 'express';
import { AbstractRoute } from "./abstract.routes";
import { StatementController } from "../controllers/statement.controller";

export class StatementRoutes extends AbstractRoute {

    private static controller = new StatementController;

    constructor() {
        super();
        this.router.get("/statements/:date?", (req: Request, res: Response) => StatementRoutes.controller.getStatement(req, res));
        this.router.delete("/statements/:id", (req: Request, res: Response) => StatementRoutes.controller.deleteTransaction(req, res));
    }
}

