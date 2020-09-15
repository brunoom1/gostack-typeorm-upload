import path from "path";
import fs from "fs";
import parse from "csv-parse/lib/sync";

import CreateTransactionService from "./CreateTransactionService";

import uploadConfig from "./../config/upload";
import Transaction from "../models/Transaction";

interface ImportTransactionsServiceOptions {
  filename: string
}

interface TransactionData {
  title: string;
  type: "income" | "outcome";
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute({ filename }: ImportTransactionsServiceOptions): Promise<Transaction[]> {

    const fileName = path.resolve(uploadConfig.directory, filename);
    const fileBuffer = await fs.promises.readFile(fileName, {
      encoding: 'utf-8',
    });
    const stringData = fileBuffer.toString();
    const records = parse(stringData, {
      bom: true,
      columns: [
        { name: 'title' },
        { name: 'type' },
        { name: 'value' },
        { name: 'category' }
      ],
      delimiter: ",",
      from_line: 2,
      trim: true
    });

    const createTransactionService = new CreateTransactionService();

    const transactions: Transaction[] = [];

    for (const record of records) {
      const {
        title,
        type,
        value,
        category
      } = record;

      const newTransaction = await createTransactionService.execute({
        title, type, value, category
      });

      transactions.push(newTransaction);
    }

    await fs.promises.unlink(fileName);

    return transactions;
  }
}

export default ImportTransactionsService;
