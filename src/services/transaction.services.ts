import { Return } from '../interfaces/types.interface';
import { IRegisterTransaction } from '../interfaces/transaction.interface';
import { Wallet } from '../models/wallet.model';

// Classe que representa os serviços da tela de investimentos
export class TransactionService implements IRegisterTransaction {

    // Método que obtem os dados das contas do usuário
    async getAccounts(userToken: string): Promise<Return> {

        try {
            // Inicializo uma instância de uma carteira
            const wallet = new Wallet(userToken);

            // Chamo o método que faz os cálculos
            const balanceData = await wallet.getAccounts();

            //Retorna a mensagem de sucesso
            return { status: 200, message: "Dados obtidos com sucesso!", data: balanceData };

        } catch (error: any) {
            return { status: error.status, message: error.message };
        }
    }

    // Método que obtem os dados das contas do usuário
    async createAccount(userToken: string, institution: string): Promise<Return> {

        try {
            // Inicializo uma instância de uma carteira
            const wallet = new Wallet(userToken);

            // Chamo o método que faz os cálculos
            const balanceData = await wallet.createAccount(institution);

            //Retorna a mensagem de sucesso
            return { status: 200, message: "Conta criada com sucesso!" };

        } catch (error: any) {
            return { status: error.status, message: error.message };
        }
    }

    // Método para criar uma nova transação
    async createTransaction(userToken: string, name: string, date: string, type: string, account: number, category: string, value:number){
        try {
            // Inicializo uma instância de uma carteira
            const wallet = new Wallet(userToken);

            // Chamo o método que faz os cálculos
            await wallet.createTransaction(name, date, type, account, category, value);

            //Retorna a mensagem de sucesso
            return { status: 200, message: "Transação criada com sucesso!" };

        } catch (error: any) {
            console.log(error)
            return { status: error.status, message: error.message };
        }
    }

}

