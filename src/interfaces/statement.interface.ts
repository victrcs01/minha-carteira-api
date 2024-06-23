import { Return } from './types.interface';

// Interface para exibir o saldo
export interface IGetStatement {
    getStatement(userToken: string, date: string): Promise<Return>;
    deleteTransaction(userToken: string, transactionId: number): Promise<Return>;
}