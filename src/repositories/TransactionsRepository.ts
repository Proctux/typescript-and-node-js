import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

enum Type {
  INCOME = 'income',
  OUTCOME = 'outcome',
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  private calculateBalance(operator: Type): number {
    return this.transactions
      .filter(transaction => transaction.type === operator)
      .reduce((previous, current) => previous + current.value, 0);
  }

  public getBalance(): Balance {
    const income = this.calculateBalance(Type.INCOME);
    const outcome = this.calculateBalance(Type.OUTCOME);

    const total = income - outcome;

    const balance: Balance = { income, outcome, total };

    return balance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    const { total } = this.getBalance();
    if (total < value && type === Type.OUTCOME) {
      throw new Error('You do not have balance!');
    }

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
