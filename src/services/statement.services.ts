import { Return } from '../interfaces/types.interface';
import { IGetStatement } from '../interfaces/statement.interface';
import { Wallet } from '../models/wallet.model';

// Classe que representa os serviços da tela de investimentos
export class StatementService implements IGetStatement {

    // Método que obtem os dados ganho financeiro
    async getStatement(userToken: string, date?: string): Promise<Return> {

        try {
            // Inicializo uma instância de uma carteira
            const wallet = new Wallet(userToken);

            // Chamo o método que faz os cálculos
            const balanceData = await wallet.getMonthStatement(date);

            //Retorna a mensagem de sucesso
            return { status: 200, message: "Dados obtidos com sucesso!", data: balanceData };

        } catch (error: any) {
            return { status: error.status, message: error.message };
        }
    }

}
