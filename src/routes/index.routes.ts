import { AbstractRoute } from "./abstract.routes";
import { HomeRoutes } from "./home.routes";
import { InvestmentRoutes } from "./investment.routes";
import { RegisterRoutes } from "./register.routes";
import { StatementRoutes } from "./statement.routes";
import { TransactionRoutes } from "./transactions.routes";

export class IndexRoutes extends AbstractRoute {

    constructor() {
        super();
        this.router.use("/register", new RegisterRoutes().router);
        this.router.use("/", new HomeRoutes().router);
        this.router.use("/", new InvestmentRoutes().router);
        this.router.use("/", new StatementRoutes().router);
        this.router.use("/", new TransactionRoutes().router)
    }
}