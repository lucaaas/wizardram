import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Group} from "./group.entity";

@Injectable()
export class GroupsService {
  public async

  constructor(@InjectRepository(Group) private groupRepository: Repository<Group>,) {
  }

  public async getByTelegramIdOrCreate(telegramId: number): Promise<Group> {
    let group: Group;

    try {
      group = await this.groupRepository.findOneOrFail({where: {'telegramId': telegramId}});
    } catch (error) {
      group = new Group();
      group.telegramId = telegramId;
    }

    return group;
  }

  public save(group: Group): Promise<Group> {
    return this.groupRepository.save(group);
  }
}