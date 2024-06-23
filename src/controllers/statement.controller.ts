import { Request, Response } from 'express';
import { StatementService } from '../services/statement.services';
import { AbstractController } from './abstract.controller';
import { AppError } from '../errors/appErros';

export class StatementController extends AbstractController {

    private service = new StatementService;

    async getStatement(req: Request, res: Response): Promise<Response> {

        try {

            // Pega o Bearer token do cabeçalho de autorização
            const { authorization } = req.headers

            // Pega a data, se tiver, dos query params da requisição
            const { date } = req.params;
            
            // Faz a validação e tratamento do token
            const userToken = this.getToken(authorization);

            // Realiza a operação no banco de dados usando o serviço
            const response = await this.service.getStatement(userToken, date);

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

    async deleteTransaction(req: Request, res: Response): Promise<Response> {

        try {

            // Pega o Bearer token do cabeçalho de autorização
            const { authorization } = req.headers

            // Pega a data, se tiver, dos query params da requisição
            const { id } = req.params;
            
            // Faz a validação e tratamento do token
            const userToken = this.getToken(authorization);

            // Realiza a operação no banco de dados usando o serviço
            const response = await this.service.deleteTransaction(userToken, parseInt(id));

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