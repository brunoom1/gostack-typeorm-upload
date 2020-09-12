// import AppError from '../errors/AppError';

import { getRepository, getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import TransactionRepository from "./../repositories/TransactionsRepository";
import Category from '../models/Category';
import AppError from '../errors/AppError';

interface CreateTransactionServiceOptions {
  title: string;
  value: number;
  type: "income" | "outcome";
  category: string;
}

class CreateTransactionService {
  public async execute({ title, value, type, category }: CreateTransactionServiceOptions): Promise<Transaction> {

    const categoryRepository = getRepository(Category);

    if (title.length === 0) {
      throw new AppError("Title is not valid");
    }

    if (category.length === 0) {
      throw new AppError("Category name is not valid");
    }

    if (['income', 'outcome'].findIndex(v => v === type) === -1) {
      throw new AppError("Invalid type. Accepteds values is income and outcome");
    }

    if (value <= 0) {
      throw new AppError("Invalid value. The greater than 0 value is need");
    }

    if (type === 'outcome') {
      const customTransactionRepository = getCustomRepository(TransactionRepository);
      const balance = await customTransactionRepository.getBalance();

      if (balance && value > balance.total) {
        throw new AppError("balance is insuficient");
      }
    }

    let categoryEntity = await categoryRepository.findOne({ title: category });

    if (!categoryEntity) {
      categoryEntity = categoryRepository.create({ title: category })
      categoryEntity = await categoryRepository.save(categoryEntity);
    }

    const transactionRepository = getRepository(Transaction);
    const newTransaction = transactionRepository.create({
      title,
      value,
      type,
      category: categoryEntity
    });

    const transaction = await transactionRepository.save(newTransaction);
    return transaction;
  }
}

export default CreateTransactionService;
