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

  @Column({ type: 'boolean', default: true })
  isAdmin: true;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToOne(() => Wallet, { eager: true })
  @JoinColumn()
  wallet: Wallet;

  @OneToMany((type) => Payment, (payment) => payment.customer, { eager: true })
  payments: Payment[];

  @CreateDateColumn()
  created_at: Date;
}
