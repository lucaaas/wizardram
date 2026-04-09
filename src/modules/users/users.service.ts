import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "./user.entity";

/**
 * UsersService
 *
 * Service responsible for managing user-related database operations.
 * Provides methods for retrieving, creating, and persisting user data.
 * Integrates with TypeORM for database access and management.
 */
@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>,) {
  }

  /**
   * Retrieves a user by their Telegram ID or creates a new user if not found.
   *
   * This method attempts to find an existing user with the specified Telegram ID.
   * If the user does not exist in the database, a new User entity is instantiated
   * with the provided Telegram ID but is not persisted to the database.
   *
   * @param {number} telegramId - The Telegram user ID to search for
   * @returns {Promise<User>} A promise that resolves to a User entity object.
   *                          If found, returns the existing user from the database.
   *                          If not found, returns a new unpersisted User instance.
   */
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

  /**
   * Retrieves a user by either their Telegram ID or username.
   *
   * Accepts a flexible identifier that can be either a numeric Telegram ID
   * or a string username.
   *
   * @param {string | number} userId - The user identifier, either a numeric Telegram ID
   *                                    or a string username (e.g., 'username' or '@username')
   * @returns {Promise<User>} A promise that resolves to the User entity if found
   * @throws {Error} Throws an error if no user is found with the given identifier
   */
  public async getByTelegramIdOrUsername(userId: string | number): Promise<User> {
    if (typeof userId === 'number') {
      return this.userRepository.findOneOrFail({where: {'telegramId': userId}});
    } else {
      const username: string = userId.replace('@', '');
      return this.userRepository.findOneOrFail({where: {'username': username}});
    }
  }

  /**
   * Saves or updates a user entity in the database.
   *
   * Persists the provided User entity to the database. If the entity has an ID,
   * it will be updated; otherwise, a new record will be created.
   *
   * @param {User} user - The User entity to be saved or updated
   * @returns {Promise<User>} A promise that resolves to the saved/updated User entity
   *                          with any database-generated values (e.g., ID, timestamps)
   */
  public save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
}