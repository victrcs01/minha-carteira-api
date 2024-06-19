import express, { json } from 'express';
import { Request, Response, Application } from 'express';
const RegisterRouter = require("./routes/register.routes.ts");

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
        this.express.use(RegisterRouter.router);
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