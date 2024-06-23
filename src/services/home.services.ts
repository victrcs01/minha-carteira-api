import { Return } from '../interfaces/types.interface';
import { IGetBalance, IGetExpensesChart } from '../interfaces/home.interface';
import { Wallet } from '../models/wallet.model';

// Classe que representa os serviços da tela inicial
export class HomeService implements IGetBalance, IGetExpensesChart {

    // Método que obtem os dados de saldo e total de receitas e despesas no mês
    async getBalance(userToken: string): Promise<Return> {

        try {
            // Inicializo uma instância de uma carteira
            const wallet = new Wallet(userToken);

            // Chamo o método que faz os cálculos
            const balanceData = await wallet.getBalance();

            //Retorna a mensagem de sucesso
            return { status: 200, message: "Dados obtidos com sucesso!", data: balanceData };

        } catch (error: any) {
            return { status: error.status, message: error.message };
        }
    }

    // Método que obtem os dados do gráfico de despesas por tipo
    async getExpensesChart(userToken: string): Promise<Return> {

        try {
            // Inicializo uma instância de uma carteira
            const wallet = new Wallet(userToken);

            // Chamo o método que faz os cálculos
            const expenseChart = await wallet.getExpensesChart();

            //Retorna a mensagem de sucesso
            return { status: 200, message: "Dados obtidos com sucesso!", data: expenseChart.data };

        } catch (error: any) {
            return { status: error.status, message: error.message };
        }
    }

}

