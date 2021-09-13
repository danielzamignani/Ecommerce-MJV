import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class DebitCard {
    @PrimaryColumn()
    id: string;

    @Column()
    ownerName: string;

    @Column()
    flag: string;

    @Column()
    number: string;

    @Column()
    validity: string

    @Column()
    cvv: string;
}
