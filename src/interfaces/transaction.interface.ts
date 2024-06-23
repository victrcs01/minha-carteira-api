import { Return } from './types.interface';

// Interface para exibir o saldo
export interface IRegisterTransaction {
    getAccounts(userToken: string): Promise<Return>;
    createAccount(userToken: string, institution: string): Promise<Return>;
    createTransaction(userToken: string, name: string, date: string, type: string, account: number, category: string, value:number): Promise<Return>;
}