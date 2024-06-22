import { Request, Response } from 'express';
import { AbstractRoute } from "./abstract.routes";
import { HomeController } from "../controllers/home.controller";

export class HomeRoutes extends AbstractRoute {

    private static controller = new HomeController;

    constructor() {
        super();
        this.router.get("/balance", (req: Request, res: Response) => HomeRoutes.controller.getBalance(req, res));
        this.router.get("/expensesChart", (req: Request, res: Response) => HomeRoutes.controller.getExpensesChart(req, res));
    }
}

