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
            const newTransaction = new Transaction( transaction. id, transaction.name, transaction.date, transaction.type, transaction.accountId, transaction.category, transaction.value);
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
    getAccountBalance(): { accountGlobalBalance: number, monthExpenses: number, monthRevenues: number } {

        // Calculando o somatório dos 3 tipos de movimentação para calcular o balanço total
        const totalExpenses = this.expenses.getTotalBalance();
        const totalRevenues = this.revenues.getTotalBalance();
        const totalAssetTransactions = this.assetTransactions.getTotalBalance();
        const accountGlobalBalance = totalExpenses + totalRevenues + totalAssetTransactions;

        // Calculando o balanço mensal de receitas e despesas
        const today = new Date();
        const monthExpenses = this.expenses.getMonthBalance(today);
        const monthRevenues = this.revenues.getMonthBalance(today);

        return { accountGlobalBalance, monthExpenses, monthRevenues };
    }

    // Método para pegar a tabela de investimentos da conta
    getInvestmentsBase(): { assetName: string, category: string, totalInvested: number, position: number, positionDate: string, return: number }[] {

        const investmentBase: { assetName: string, category: string, totalInvested: number, position: number, positionDate: string, return: number }[] = [];

        // Primeiro preenche os valores de posição
        this.assetValue.forEach(assetPosition => {

            // Primeiro tenta verificar se existe este ativo
            const existingEntry = investmentBase.find(
                entry => entry.assetName === assetPosition.name
            );

            // Se existir, vai atualizar os valores se for uma posição mais recente
            if (existingEntry) {
                const entryDate = new Date(existingEntry.positionDate);
                if (assetPosition.dateObject > entryDate) {
                    existingEntry.position = assetPosition.value;
                    existingEntry.positionDate = assetPosition.date;
                }
            } else {

                // Se não tiver, cria o regristro para o ativo na base 
                investmentBase.push({
                    assetName: assetPosition.name,
                    category: assetPosition.category,
                    totalInvested: 0,
                    position: assetPosition.value,
                    positionDate: assetPosition.date,
                    return: 0
                });
            }

        })

        // Agora faz o loop na base, terminando de completar a tabela com as informações de movimentação
        investmentBase.forEach(asset => {
            
            // Pega o valor total investido (somatório de aplicações + resgates)
            const totalInvested = this.assetTransactions.getAssetBalance(asset.assetName);

            // Calcula o retorno do ativo (posição final - movimentações)
            const asserReturn = asset.position - totalInvested;

            // Atualiza a base com as novas informações
            asset.totalInvested = totalInvested;
            asset.return = asserReturn;
        })

        return investmentBase;
    }

    // Método para buscar o extrato mensal da conta
    getMonthStatement(date : Date) : Array<Transaction> {

        // Inicializa a variável que ira armazenar o extrato
        const monthStatement = [];

        // Adiciona na variável as movimentações de todos os tipos
        monthStatement.push(...this.expenses.getTransactions(date));
        monthStatement.push(...this.revenues.getTransactions(date));
        monthStatement.push(...this.assetTransactions.getTransactions(date));

        return monthStatement;

    }

}
