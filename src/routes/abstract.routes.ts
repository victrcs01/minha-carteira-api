import { Router } from 'express';

class AbstractRoute {

    public router: Router;

    constructor() {
        this.router = Router();
    }

}

module.exports = AbstractRoute;