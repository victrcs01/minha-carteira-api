import { Request, Response } from 'express';
import { HomeService } from '../services/home.services';
import { AbstractController } from './abstract.controller';
import { AppError } from '../errors/appErros';

export class HomeController extends AbstractController {

    private service = new HomeService;

    async getBalance(req: Request, res: Response): Promise<Response> {

        try {

            // Pega o Bearer token do cabeçalho de autorização
            const { authorization } = req.headers

            // Faz a validação e tratamento do token
            const userToken = this.getToken(authorization);

            // Realiza a operação no banco de dados usando o serviço
            const response = await this.service.getBalance(userToken);

            // Retorna as informações do usuário
            return res.status(response.status).json({
                message: response.message,
                data: response.data
            });

        } catch (error: AppError | any) {
            return res.status(error.status).json({
                message: error.message
            });
        }
    };

    async getExpensesChart(req: Request, res: Response): Promise<Response> {

        try {

            // Pega o Bearer token do cabeçalho de autorização
            const { authorization } = req.headers

            // Faz a validação e tratamento do token
            const userToken = this.getToken(authorization);

            // Realiza a operação no banco de dados usando o serviço
            const response = await this.service.getExpensesChart(userToken);

            // Retorna as informações do usuário
            return res.status(response.status).json({
                message: response.message,
                data: response.data
            });

        } catch (error: AppError | any) {
            return res.status(error.status).json({
                message: error.message
            });

        }
    };

}