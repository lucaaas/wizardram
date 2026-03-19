import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Group, GroupUser} from "./group.entity";
import {User} from "../users/user.entity";

@Injectable()
export class GroupsService {

  constructor(@InjectRepository(Group) private groupRepository: Repository<Group>,
              @InjectRepository(GroupUser) private groupUserRepository: Repository<GroupUser>,) {
  }

  public async getByTelegramIdOrCreate(telegramId: number): Promise<Group> {
    let group: Group;

    try {
      group = await this.groupRepository.findOneOrFail({where: {'telegramId': telegramId}});
    } catch (error) {
      group = new Group();
      group.telegramId = telegramId;

      await this.save(group);
    }

    return group;
  }

  public async getUserGroup(user: User, groupId: number): Promise<GroupUser> {
    let groupUser: GroupUser;

    const group: Group = await this.getByTelegramIdOrCreate(groupId);
    try {
      groupUser = await this.groupUserRepository
        .createQueryBuilder('groupUser')
        .leftJoinAndSelect('groupUser.user', 'user')
        .leftJoinAndSelect('groupUser.group', 'group')
        .where('groupUser.userId = :userId', {userId: user.id})
        .andWhere('groupUser.groupId = :groupId', {groupId: group.id})
        .getOneOrFail();

    } catch (error) {
      groupUser = new GroupUser();
      groupUser.group = group;
      groupUser.user = user;

      await this.groupUserRepository.save(groupUser);
    }

    return groupUser;
  }

  public async addOneOnQuantityMessages(user: User, groupTelegramId: number): Promise<void> {
    const groupUser: GroupUser = await this.getUserGroup(user, groupTelegramId);
    groupUser.quantityMessages++;
    await this.groupUserRepository.save(groupUser);
  }

  public save(group: Group): Promise<Group> {
    return this.groupRepository.save(group);
  }
}