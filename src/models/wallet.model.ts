import { Return } from '../interfaces/types.interface';
import { AppError } from '../errors/appErros';
import { JWT } from '../utils/jwt.utils';
import { Account } from './account.model';
import { ChartData } from '../utils/chartData.utils';
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
    async getBalance(): Promise<object> {

        // Busca as contas no banco de dados
        await this.loadAccounts();

        // Inicializa o acumulador do balaço das contas e a matriz que irá armazenar os balanços individuais
        const walletBalance = { globalBalance: 0, monthExpenses: 0, monthRevenues: 0 };
        const accountsBalance: { accountId: number, accountName: string, accountBalance: number }[] = [];

        // Loop nas contas, buscando as informações de balanço
        for (const account of this.accounts) {
            await account.loadTransactions();
            const accountBalance = account.getAccountBalance();

            // Atualiza o balanço global das contas
            walletBalance.globalBalance += accountBalance.accountGlobalBalance;
            walletBalance.monthExpenses += accountBalance.monthExpenses;
            walletBalance.monthRevenues += accountBalance.monthRevenues;

            // salva o balanço individual
            accountsBalance.push({ accountId: account.id, accountName: account.institution, accountBalance: accountBalance.accountGlobalBalance });
        }

        return { walletBalance, accountsBalance };
    }

    // Método para pegar o gráfico de despesas
    async getExpensesChart(): Promise<ChartData> {

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
        return walletExpensesChartData;
    }

    async getInvestmentData(): Promise<object> {

        // Busca as contas no banco de dados
        await this.loadAccounts();

        const investmentBase: { assetName: string, category: string, totalInvested: number, position: number, positionDate: string, return: number }[] = [];

        // Loop nas contas, buscando as informações de investimentos
        for (const account of this.accounts) {

            // Carrega as informações de transações
            await account.loadTransactions();

            // Gera a base de investimentos
            const accountInvestments = account.getInvestmentsBase();

            // Transfere os dados para a base globla
            investmentBase.push(...accountInvestments)

        }

        // Agora faz novamente um loop nessa base, gerando o gráifo de investimetnos
        const investMentChart = new ChartData();
        for (const entry of investmentBase) {
            investMentChart.addCategory(entry.category, entry.position)
        }
        const investMentChartData = investMentChart.data;

        return { investmentBase, investMentChartData };
    }
}