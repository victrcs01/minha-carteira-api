import { Return } from '../interfaces/types.interface';
import { IGetInvestmentData } from '../interfaces/investment.interface';
import { Wallet } from '../models/wallet.model';
const { prisma } = require('../prisma/prismaClient');

// Classe que representa os serviços da tela de investimentos
export class InvestmentService implements IGetInvestmentData {

    // Método que obtem os dados ganho financeiro
    async getInvestmentData(userToken: string): Promise<Return> {

        try {
            // Inicializo uma instância de uma carteira
            const wallet = new Wallet(userToken);

            // Chamo o método que faz os cálculos
            const balanceData = await wallet.getInvestmentData();

            //Retorna a mensagem de sucesso
            return { status: 200, message: "Dados obtidos com sucesso!", data: balanceData };

        } catch (error: any) {
            return { status: error.status, message: error.message };
        }
    }

}

