import { Router } from 'express';

export abstract class AbstractRoute {

    public router: Router;

    constructor() {
        this.router = Router();
    }

}