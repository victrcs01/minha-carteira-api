import { Return } from '../interfaces/types.interface';
import { AppError } from '../errors/appErros';
import { JWT } from './jwt.model';
import { Account } from './account.model';
import { ChartData } from './chartData.model';
const { prisma } = require('../prisma/prismaClient');

export class Wallet {

    public userId: number;
    protected accounts: Array<Account> = [];

    constructor(userToken: string) {
        const userId = JWT.authenticateToken(userToken);
        if (userId) {
            this.userId = userId;
        } else {
            throw new AppError('Token de acesso inválido.', 401);
        };
    };

    // Método para pegar os dados das contas no banco de dados
    private async loadAccounts() {

        // Busca os registros no banco
        const accountsData: Array<Account> = await prisma.accounts.findMany({
            where: {
                userId: this.userId,
            }
        });

        // Cria instâncias de Account com os registros do banco
        accountsData.forEach(async accountData => {
            const account = new Account(accountData.id, accountData.institution);
            this.accounts.push(account); // Salva os objetos na propriedade da classe
        });
    };

    // Método para pegar o resumo de saldo, receitas e despesas
    async getBalance() {

        // Busca as contas no banco de dados
        await this.loadAccounts();

        // Inicializa o acumulador do banaço das contas
        let walletBalance = { globalBalance: 0.0, monthExpenses: 0, monthRevenues: 0 };

        // Loop nas contas, buscando as informações de balanço
        for (const account of this.accounts) {
            await account.loadTransactions();
            const accountBalance = account.getAccountBalance();

            walletBalance.globalBalance += accountBalance.accountGlobalBalance;
            walletBalance.monthExpenses += accountBalance.monthExpenses;
            walletBalance.monthRevenues += accountBalance.monthRevenues;
        }

        return walletBalance;
    }

    // Método para pegar o gráfico de despesas
    async getExpensesChart() {

        // Busca as contas no banco de dados
        await this.loadAccounts();

        // Cria um objeto com a data de hoje
        const today = new Date();

        // Inicializa o acumulador do balaço das contas
        const walletExpensesChartData = new ChartData();

        // Loop nas contas, buscando as informações de balanço e consolidando tudo numa única array
        for (const account of this.accounts) {
            await account.loadTransactions();
            const accountExpensesChartData = account.expenses.groupByCategory(today);
            walletExpensesChartData.addChartData(accountExpensesChartData);
        }
        return walletExpensesChartData.data;
    }
}