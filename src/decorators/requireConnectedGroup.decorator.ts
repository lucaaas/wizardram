import {UsersService} from "../modules/users/users.service";
import {Injectable} from "@nestjs/common";
import {CommandContext, Context} from "grammy";

/**
 * RequireConnectedGroupDecorator
 *
 * A NestJS injectable class that provides a decorator factory for ensuring that
 * Telegram bot commands executed in private chats are only allowed if the user
 * has a connected group.
 *
 * Behavior:
 * - If command is executed in a group chat: Allows execution immediately without checks
 * - If command is executed in a private chat: Verifies user has a connected group.
 *   If no connected group exists, sends a message to the user instructing them to
 *   connect to a group using the /connect command, and blocks method execution.
 *
 * This decorator is useful for commands that operate on a specific group and need
 * to ensure context when invoked from a private chat.
 *
 * // On a bot command handler method:
 * @RequireConnectedGroupDecorator.apply()
 * async handleGroupCommand(ctx: CommandContext<Context>) {
 *   await ctx.reply('Command executed for your connected group');
 * }
 */
@Injectable()
export class RequireConnectedGroupDecorator {
  private static usersService: UsersService;

  constructor(usersService: UsersService) {
    RequireConnectedGroupDecorator.usersService = usersService;
  }

  public static apply() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      const originalMethod = descriptor.value;
      descriptor.value = async function (...args: any[]) {
        const ctx: CommandContext<Context> = args[0];

        if (ctx.chat.type !== 'private') {
          return originalMethod.apply(this, args);
        } else {
          const user = await RequireConnectedGroupDecorator.usersService.getByTelegramIdOrCreate(ctx.chatId);
          if (user.connectedGroupId) {
            return originalMethod.apply(this, args);
          } else {
            await ctx.reply('Você ainda não conectou a nenhum grupo. Use o comando /connect para conectar a um grupo.')
            return;
          }
        }
      };
    }
  }
}