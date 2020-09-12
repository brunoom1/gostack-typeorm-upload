import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import Category from "./Category";

@Entity({
  name: "transactions"
})
class Transaction {

  @PrimaryGeneratedColumn({
    type: 'uuid'
  })
  id: string;

  @Column()
  title: string;

  @Column()
  type: 'income' | 'outcome';

  @Column()
  value: number;

  @ManyToOne(target => Category)
  @JoinColumn({
    name: 'category_id',
    referencedColumnName: 'id'
  })
  category: Category

  @Column()
  category_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Transaction;
