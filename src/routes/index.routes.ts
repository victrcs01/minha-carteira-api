import { AbstractRoute } from "./abstract.routes";
import { RegisterRoutes } from "./register.routes";

export class IndexRoutes extends AbstractRoute {

    constructor() {
        super();
        this.router.use("/register", new RegisterRoutes().router);
    }
}