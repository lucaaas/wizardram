import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "./user.entity";

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>,) {
    }

    public getByTelegramId(telegramId: number): Promise<User> {
        return this.userRepository.findOneOrFail({where: {'telegramId': telegramId}});
    }

    public save(user: User): Promise<User> {
        return this.userRepository.save(user);
    }
}