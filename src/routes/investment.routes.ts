import { Request, Response } from 'express';
import { AbstractRoute } from "./abstract.routes";
import { InvestmentController } from "../controllers/investment.controller";

export class InvestmentRoutes extends AbstractRoute {

    private static controller = new InvestmentController;

    constructor() {
        super();
        this.router.get("/investmentData", (req: Request, res: Response) => InvestmentRoutes.controller.getInvestmentData(req, res));
    }
}

