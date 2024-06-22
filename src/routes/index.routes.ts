import { AbstractRoute } from "./abstract.routes";
import { HomeRoutes } from "./home.routes";
import { RegisterRoutes } from "./register.routes";

export class IndexRoutes extends AbstractRoute {

    constructor() {
        super();
        this.router.use("/register", new RegisterRoutes().router);
        this.router.use("/", new HomeRoutes().router);
    }
}