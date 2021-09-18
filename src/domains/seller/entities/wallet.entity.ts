import { Transaction } from 'src/domains/payment/entities/transaction.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
3;

@Entity()
export class Wallet {
  @PrimaryColumn()
  id: string;

  @Column()
  sellerName: string;

  @Column({ type: 'int', default: 0 })
  amount: number;

  @OneToMany((type) => Transaction, (transaction) => transaction.wallet, {
    eager: true,
  })
  transaction: Transaction[];
}
