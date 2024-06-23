import { Request, Response } from 'express';
import { AbstractRoute } from "./abstract.routes";
import { TransactionController } from "../controllers/transaction.controller";

export class TransactionRoutes extends AbstractRoute {

    private static controller = new TransactionController;

    constructor() {
        super();
        this.router.get("/accounts", (req: Request, res: Response) => TransactionRoutes.controller.getAccounts(req, res));
        this.router.post("/accounts", (req: Request, res: Response) => TransactionRoutes.controller.createAccount(req, res));
        this.router.post("/transactions", (req: Request, res: Response) => TransactionRoutes.controller.createTransaction(req, res));
    }
}

