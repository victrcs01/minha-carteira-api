import express, { json } from 'express';
import {  Application } from 'express';
import { IndexRoutes } from './routes/index.routes';

// Classe que representa a aplicação propriamente dita
class App {

    private express: Application;

    constructor() {
        this.express = express();
        this.middlewares();
        this.routes();
    }

    // Método que configura os middlewares que serão executados globalmente na aplicação
    private middlewares(): void {
        this.express.use(json()); // Middleware para o uso de json
    }

    // Método que chama a classe com as rotas da aplicação
    private routes(): void {
        this.express.use(new IndexRoutes().router);
    }

    // Método que será utilizado pela classe Server para inicializar o servidor
    public listen(port: number): void {
        this.express.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    }
}

// Exporta a classe já instânciada
export default new App();