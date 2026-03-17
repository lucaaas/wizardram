import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    telegramId: number;

    @Column({nullable: true})
    connectedGroupId: number | undefined;
}