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

    // Método para pegar os dados das contas no banco de dados e criar
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
    };

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
    };

    // Método para pegar a tabela e o gráfico de investimentos
    async getInvestmentData(): Promise<object> {

        // Busca as contas no banco de dados
        await this.loadAccounts();

        const investmentBase: { assetName: string, category: string, totalInvested: number, position: number, positionDate: string, return: number }[] = [];
        const investmentList: { x: string; y: number }[] = [];

        // Loop nas contas, buscando as informações de investimentos
        for (const account of this.accounts) {

            // Carrega as informações de transações
            await account.loadTransactions();

            // Gera a base de investimentos
            const accountInvestments = account.getInvestmentsBase();
            const accountInvestmentsList = account.getInvestmentsList();

            // Transfere os dados para a base globla
            investmentBase.push(...accountInvestments);
            investmentList.push(...accountInvestmentsList.data);
        }

        // Agora faz novamente um loop nessa base, gerando o gráifo de investimetnos 
        const investmentChart = new ChartData();
        for (const entry of investmentBase) {
            console.log(entry)
            investmentChart.addCategory(entry.category, entry.position)
        }
        
        const investmentChartData = investmentChart.data;

        return { investmentBase, investmentChartData, investmentList };
    };

    // Método para pegar o extrato mensal da conta
    async getMonthStatement(date: string | undefined) {

        // Busca as contas no banco de dados
        await this.loadAccounts();

        // Cria um objeto com a data passada
        const dateObjetc = date ? new Date(date) :  new Date()

        const monthStatement = [];

        // Loop nas contas, buscando os extratos
        for (const account of this.accounts) {
            await account.loadTransactions();
            monthStatement.push(...account.getMonthStatement(dateObjetc))
        }

        // Ordena a base do mais antigo para o mais recente
        monthStatement.sort((a, b) => a.dateObject.getTime() - b.dateObject.getTime());

        // Edita a ordem e quais colunas terão na base
        return monthStatement.map(entry => {
            return { "id": entry.id, "Data": entry.date, "Movimentação": entry.name, "Valor": entry.value, "Tipo": entry.type, "Categoria": entry.category  };
        })
    };

    // Método para pegar os dados das contas no banco de dados
    async getAccounts() : Promise<{id: number, institution: string }[]> {
        
        // Busca as contas no banco de dados
        await this.loadAccounts();

        return this.accounts.map(account => {
            console.log(account.id)
            return { id: account.id, institution: account.institution}
        })
    };

    // Método para criar uma nova conta 
    async createAccount (institution: string) {
        await prisma.accounts.create({
            data: {
                userId: this.userId,
                institution: institution,
            }
        })
    }

    // Método para criar uma nova transação
    async createTransaction( name: string, date: string, type: string, accountId: number, category: string, value:number) {
        
        const dateObject = new Date(date)

        // Faz o tratamento dos sinais
        if (type === "Receita" || type === "Aplicação" || type === "Posição") {
            value < 0 ? value*= -1 : value;  
        } else if(type === "Despesa" || type === "Resgate" ) {
            value > 0 ? value*= -1 : value;  
        }

        await prisma.transactions.create({
            data: {
                name,
                date: dateObject.toISOString(),
                type,
                accountId,
                category,
                value
            }
        })
    }

    // Método para deletar uma transação
    async deleteTransaction(transactionId: number) {
        await prisma.transactions.delete({
            where: {
                id: transactionId
            }
        })
    }
}