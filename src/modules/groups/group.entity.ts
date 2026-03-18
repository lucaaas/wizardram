import {Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../users/user.entity";

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  telegramId: number;

  @OneToMany(() => GroupUser, (groupUser) => groupUser.group)
  groupUser: GroupUser[];
}

@Entity()
export class GroupUser {
  @ManyToOne(() => User, (user) => user.groupUser, {onDelete: "CASCADE"})
  @PrimaryColumn({type: "int", name: "userId"})
  user: User;

  @ManyToOne(() => Group, (group) => group.groupUser, {onDelete: "CASCADE"})
  @PrimaryColumn({type: "int", name: "groupId"})
  group: Group;

  @Column({default: 0})
  quantityMessages: number;
}