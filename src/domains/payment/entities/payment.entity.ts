import { Customer } from 'src/domains/customer/entities/customer.entity';
import { Seller } from 'src/domains/seller/entities/seller.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { DebitCard } from './debit-card.entity';

@Entity()
export class Payment {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'int' })
  amount: number;

  @Column({ default: 'Pending' })
  status: string;

  @ManyToOne((type) => Customer, (customer) => customer.payments)
  customer: Customer;

  @ManyToOne((type) => Seller, (seller) => seller.payments)
  seller: Seller;

  @OneToOne(() => DebitCard, { eager: true })
  @JoinColumn()
  debitCard: DebitCard;

  @CreateDateColumn()
  created_at: Date;
}
