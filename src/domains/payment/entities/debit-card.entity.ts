import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class DebitCard {
  @PrimaryColumn()
  id: string;

  @Column()
  holder: string;

  @Column()
  brand: string;

  @Column()
  cardNumber: string;

  @Column()
  expirationDate: string;

  @Column()
  securityCode: string;
}
