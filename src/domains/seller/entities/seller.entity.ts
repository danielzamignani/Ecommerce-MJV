import { Payment } from 'src/domains/payment/entities/payment.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Wallet } from './wallet.entity';

@Entity()
export class Seller {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToOne(() => Wallet, { eager: true })
  @JoinColumn()
  wallet: Wallet;

  @OneToMany((type) => Payment, (payment) => payment.seller)
  payments: Payment[];

  @Column({ default: 'Seller' })
  accountType: string;

  @CreateDateColumn()
  created_at: Date;
}
