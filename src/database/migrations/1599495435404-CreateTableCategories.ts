import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTableCategories1599495435404 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

		await queryRunner.createTable(new Table({
			name: 'categories',
			columns: [
				{
					name: 'id',
					type: 'UUID',
					generationStrategy: "uuid",
					default: 'uuid_generate_v4()',
					isPrimary: true,
				},
				{
					name: 'title',
					type: 'varchar',
					isNullable: false
				},
				{
					name: "created_at",
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

	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('categories');
	}
}
