//const { authController } = require("../controllers/auth.controller");
//const { authenticateToken } = require("../middlewares/auth.middleware");
const AbstractRoute = require("./abstract.routes.ts");

class AuthRouter extends AbstractRoute {

    constructor() {
        super();
        //this.router.post("/user", controller.authenticateUser);
        //this.router.post("/token", authenticateToken, controller.authenticateToken);
    }
}

module.exports = new AuthRouter();

