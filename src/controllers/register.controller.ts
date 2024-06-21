import { Request, Response } from 'express';
import { RegisterService } from '../services/register.services';

export class RegisterController {

    private service = new RegisterService;

    async createNewUser(req: Request, res: Response): Promise<Response> {

        // Pega os dados de login do corpo da requisição
        const username = req.body.username;
        const fullname = req.body.fullname;
        const password = req.body.password;

        // Realiza a operação no banco de dados usando o serviço
        const response = await this.service.createUser(username, fullname, password);

        // Retorna as informações do usuário
        return res.status(response.status).json({
            message: response.message
        });
    };

    async authenticateUser(req: Request, res: Response): Promise<Response> {

        // Pega os dados de login do corpo da requisição
        const username = req.body.username;
        const password = req.body.password;

        // Realiza a operação no banco de dados usando o serviço
        const response = await this.service.authenticateUser(username, password);

        // Retorna as informações do usuário
        return res.status(response.status).json({
            message: response.message,
            data: response.data
        });
    };

}