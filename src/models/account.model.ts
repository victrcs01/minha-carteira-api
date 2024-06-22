import { Return } from '../interfaces/types.interface';
import { AppError } from '../errors/appErros';
import { Transaction } from './transaction.model';
import { Transactions } from './transactions.model';
const { prisma } = require('../prisma/prismaClient');

export class Account {

    public id: number;
    public institution: string;
    public expenses: Transactions;
    public revenues: Transactions;
    public assetValue: Array<Transaction>;
    public assetTransactions: Transactions;

    constructor(accountId: number, institution: string) {
        this.id = accountId;
        this.institution = institution;
        this.expenses = new Transactions;
        this.revenues = new Transactions;
        this.assetTransactions = new Transactions;
        this.assetValue = [];
    }

    // Método para pegar os dados das transações no banco de dados
    async loadTransactions() {

        // Busca os registros no banco
        const transactionsData: Array<Transaction> = await prisma.transactions.findMany({
            where: {
                accountId: this.id,
            }
        });

        // Cria os objetos de transação de já deixa classificado.
        transactionsData.forEach(transaction => {
            const newTransaction = new Transaction(transaction.name, transaction.date, transaction.type, transaction.accountId, transaction.category, transaction.value);
            if (newTransaction.type === "Receita") {
                this.revenues.loadTransaction(newTransaction);
            } else if (newTransaction.type === "Despesa") {
                this.expenses.loadTransaction(newTransaction);
            } else if (newTransaction.type === "Aplicação" || newTransaction.type === "Resgate") {
                this.assetTransactions.loadTransaction(newTransaction);
            } else if (newTransaction.type === "Posição") {
                this.assetValue.push(newTransaction);
            };
        });
    }

    // Método para pegar o balanço da conta
    getAccountBalance(): { accountGlobalBalance: number,  monthExpenses: number, monthRevenues: number} {

        // Calculando o somatório dos 3 tipos de movimentação para calcular o balanço total
        const totalExpenses = this.expenses.getTotalBalance();
        const totalRevenues = this.revenues.getTotalBalance();
        const totalAssetTransactions = this.assetTransactions.getTotalBalance();
        const accountGlobalBalance = totalExpenses + totalRevenues + totalAssetTransactions;

        // Calculando o balanço mensal de receitas e despesas
        const today = new Date();
        const monthExpenses = this.expenses.getMonthBalance(today);
        const monthRevenues = this.revenues.getMonthBalance(today);

        return { accountGlobalBalance,  monthExpenses, monthRevenues};
    }

}
