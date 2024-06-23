import { Request, Response } from 'express';
import { TransactionService } from '../services/transaction.services';
import { AbstractController } from './abstract.controller';
import { AppError } from '../errors/appErros';

export class TransactionController extends AbstractController {

    private service = new TransactionService;

    async getAccounts(req: Request, res: Response): Promise<Response> {

        try {

            // Pega o Bearer token do cabeçalho de autorização
            const { authorization } = req.headers
            
            // Faz a validação e tratamento do token
            const userToken = this.getToken(authorization);

            // Realiza a operação no banco de dados usando o serviço
            const response = await this.service.getAccounts(userToken);

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

    async createTransaction(req: Request, res: Response): Promise<Response> {

        try {

            // Pega o Bearer token do cabeçalho de autorização
            const { authorization } = req.headers;

            // Pega os dados do corpo da requisição
            const { name, date, type, account, category, value } = req.body;

            // Faz a validação e tratamento do token
            const userToken = this.getToken(authorization);

            // Realiza a operação no banco de dados usando o serviço
            const response = await this.service.createTransaction(userToken, name, date, type, account, category, value);


            // Retorna as informações do usuário
            return res.status(response.status).json({
                message: response.message
            });

        } catch (error: AppError | any) {
            return res.status(error.status).json({
                message: error.message
            });

        }
    };

    async createAccount(req: Request, res: Response): Promise<Response> {

        try {

            // Pega o Bearer token do cabeçalho de autorização
            const { authorization } = req.headers;

            // Pega a instituição do corpo
            const { institution } = req.body;

            // Faz a validação e tratamento do token
            const userToken = this.getToken(authorization);

            // Realiza a operação no banco de dados usando o serviço
            const response = await this.service.createAccount(userToken, institution);

            // Retorna as informações do usuário
            return res.status(response.status).json({
                message: response.message
            });

        } catch (error: AppError | any) {
            return res.status(error.status).json({
                message: error.message
            });

        }
    };

}