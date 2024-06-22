import { Return } from '../interfaces/types.interface';

// Interface para exibir o saldo
export interface IGetBalance {
    getBalance(userToken: string): Promise<Return>;
}

// Interface para exibir os dados do gráfico de despesas
export interface IGetExpensesChart {
    getExpensesChart(userToken: string): Promise<Return>;
}