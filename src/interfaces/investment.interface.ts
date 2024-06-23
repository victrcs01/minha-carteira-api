import { Return } from './types.interface';

// Interface para exibir o saldo
export interface IGetInvestmentData {
    getInvestmentData(userToken: string): Promise<Return>;
}