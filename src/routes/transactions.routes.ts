import { Router } from 'express';
import { getCustomRepository } from "typeorm";
import multer from "multer";

import uploadConfig from "./../config/upload";
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';


const transactionsRouter = Router();


transactionsRouter.get('/', async (request, response) => {
  const transactionRepository = getCustomRepository(TransactionsRepository);

  const balance = await transactionRepository.getBalance();
  const transactions = await transactionRepository.find();

  return response.json({
    transactions,
    balance
  });
});


transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const transactionService = new CreateTransactionService();
  const transaction = await transactionService.execute({
    title,
    value,
    type,
    category
  });

  return response.json(transaction);
});


transactionsRouter.delete('/:id', async (request, response) => {
  const deleteTransactionService = new DeleteTransactionService();
  const { id } = request.params;
  await deleteTransactionService.execute({ id });

  return response.status(204).json({});
});


const upload = multer({
  dest: uploadConfig.directory
});
transactionsRouter.post('/import', upload.single('file'), async (request, response) => {
  const importTransactionsService = new ImportTransactionsService();

  const transactions = await importTransactionsService.execute({
    filename: request.file.filename
  });

  return response.status(201).json(transactions);
});


export default transactionsRouter;
