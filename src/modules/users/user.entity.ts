import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {GroupUser} from "../groups/group.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  telegramId: number;

  @Column({nullable: true})
  username?: string;

  @Column({nullable: true, type: "bigint"})
  connectedGroupId?: number;

  @OneToMany(() => GroupUser, (groupUser) => groupUser.user)
  groupUser: GroupUser[];
}