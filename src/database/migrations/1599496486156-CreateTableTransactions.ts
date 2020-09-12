import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTableTransactions1599496486156 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(new Table({
      name: 'transactions',
      columns: [
        {
          name: 'id',
          type: 'UUID',
          generationStrategy: 'uuid',
          isPrimary: true,
          default: 'uuid_generate_v4()'
        },
        {
          name: 'category_id',
          type: 'UUID'
        },
        {
          name: 'title',
          type: 'varchar'
        },
        {
          name: 'value',
          type: 'decimal(10,2)'
        },
        {
          name: 'type',
          type: 'varchar'
        },
        {
          name: 'created_at',
          type: 'timestamp',
          default: 'now()'
        },
        {
          name: 'updated_at',
          type: 'timestamp',
          default: 'now()'
        }
      ]
    }));

    await queryRunner.createForeignKey('transactions', new TableForeignKey({
      columnNames: ['category_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'categories',
      name: 'ForeignKeyTransactionCategory',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropForeignKey('transactions', 'ForeignKeyTransactionCategory');
    await queryRunner.dropTable('transactions');
  }

}
