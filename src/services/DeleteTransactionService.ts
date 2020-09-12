// import AppError from '../errors/AppError';

import { getCustomRepository } from "typeorm";

import TransactionsRepository from "./../repositories/TransactionsRepository";

interface DeleteTransactionServiceOptions {
  id: string
};

class DeleteTransactionService {
  public async execute({ id }: DeleteTransactionServiceOptions): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    await transactionRepository.delete({ id });
  }
}

export default DeleteTransactionService;
