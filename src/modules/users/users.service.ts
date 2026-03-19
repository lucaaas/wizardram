import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "./user.entity";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>,) {
  }

  public async getByTelegramIdOrCreate(telegramId: number): Promise<User> {
    let user: User;

    try {
      user = await this.userRepository.findOneOrFail({where: {'telegramId': telegramId}});
    } catch (error) {
      user = new User();
      user.telegramId = telegramId;
    }

    return user;
  }

  public save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
}