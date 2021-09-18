import { Wallet } from 'src/domains/seller/entities/wallet.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'int' })
  amount: number;

  @Column()
  orderId: string;

  @ManyToOne((type) => Wallet, (wallet) => wallet.transaction)
  wallet: Wallet;
}
