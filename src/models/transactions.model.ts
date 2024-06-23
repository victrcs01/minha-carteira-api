import { assert } from 'console';
import { ChartData } from '../utils/chartData.utils';
import { Transaction } from './transaction.model';

export class Transactions {

  public data: Array<Transaction>;

  constructor() {
    this.data = [];
  }

  // Método para fazer o carregamento das transações na matriz
  loadTransaction(transaction: Transaction): void {
    this.data.push(transaction);
  }

  // Método para obter o balanço dessas transações
  getTotalBalance(): number {
    return this.data.reduce((total: number, transaction) => {
      return total + transaction.value;
    }, 0);
  }

  // Método para o balanço de determinado mês
  getMonthBalance(date: Date): number {
    return this.data.reduce((total, transaction) => {
      if (transaction.dateObject.getMonth() === date.getMonth() && transaction.dateObject.getFullYear() === date.getFullYear()) {
        return total + transaction.value;
      }
      return total;
    }, 0);
  }

  // Método para gerar o gráfico por categoria de transação
  groupByCategory(date?: Date): ChartData {

    // Inicializa a matriz que vai salvar o dado agrupado
    const transactionsByType = new ChartData;

    // Loop nos dados
    this.data.forEach(transaction => {

      // Verifica se foi informado uma data e, se sim, se deve filtrar o item do loop
      const shouldIncludeTransaction = !date ||
        (date &&
          transaction.dateObject.getMonth() === date.getMonth() &&
          transaction.dateObject.getFullYear() === date.getFullYear());

      if (shouldIncludeTransaction) {
        transactionsByType.addCategory(transaction.category, transaction.value);
      }
    });

    return transactionsByType;
  }

  // Método para o balanço de determinado ativo
  getAssetBalance(assetName: string): number {
    return this.data.reduce((total, transaction) => {
      if (transaction.name === assetName) {
        return total + transaction.value;
      }
      return total;
    }, 0);
  }

  // Método para retornar as movimentações de determinado mês
  getTransactions(date: Date) : Array<Transaction> {
    return this.data.filter(entry => {
      const entryDate = entry.dateObject;
      return entryDate.getUTCMonth() === date.getUTCMonth() && entryDate.getUTCFullYear() === date.getUTCFullYear();
  });

  }
}