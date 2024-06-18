import express, { json } from 'express';
import { Request, Response } from 'express';

class App {
    public express: express.Application

    constructor() {

        this.express = express();
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.express.use(json());
    }

    routes() {
        this.express.get('/', (req: Request, res: Response) => {
            res.send('Hello, TypeScript with Express!');
        });
    }

    listen(port: number) {
        this.express.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
          });
    }
}

export default new App();