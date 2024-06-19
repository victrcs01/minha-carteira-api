import { Router } from 'express';

class AbstractRoute {

    router: Router;

    constructor() {
        this.router = Router();
    }

}

module.exports = AbstractRoute;