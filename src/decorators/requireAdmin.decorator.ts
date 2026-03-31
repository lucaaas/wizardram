import {UsersService} from "../modules/users/users.service";
import {Injectable} from "@nestjs/common";
import {CommandContext, Context} from "grammy";

/**
 * RequireAdminDecorator
 *
 * A NestJS class that provides a decorator factory for protecting
 * Telegram bot command handlers with admin-level access control.
 *
 * This decorator verifies that the user executing a command is either:
 * - A creator or administrator of the Telegram group (if the command is executed in a group)
 * - An administrator of a connected group (if the command is executed in a private chat)
 *
 * If authorization fails, the user receives a Telegram message explaining why they
 * cannot execute the command. The decorated method is not invoked in this case.
 *
 * @example
 * @RequireAdminDecorator.apply()
 * async handleBanUser(ctx: CommandContext<Context>) {
 *   // Only executes if user is admin
 * }
 */
@Injectable()
export class RequireAdminDecorator {
  private static usersService: UsersService;

  constructor(usersService: UsersService) {
    RequireAdminDecorator.usersService = usersService;
  }

  public static apply() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      const originalMethod = descriptor.value;
      descriptor.value = async function (...args: any[]) {
        const ctx: CommandContext<Context> = args[0];
        let groupTelegramId: number;

        if (ctx.chat.type === 'private') {
          const user = await RequireAdminDecorator.usersService.getByTelegramIdOrCreate(ctx.chatId);
          if (user.connectedGroupId) {
            groupTelegramId = user.connectedGroupId;
          } else {
            await ctx.reply('Você ainda não conectou a nenhum grupo. Use o comando /connect para conectar a um grupo.')
            return;
          }
        } else {
          groupTelegramId = ctx.chatId;
        }

        const member = await ctx.api.getChatMember(groupTelegramId, ctx.from!.id);
        if (member.status === 'creator' || member.status === 'administrator') {
          return originalMethod.apply(this, args);
        } else {
          await ctx.reply('Você precisa ser um administrador do grupo para usar este comando.');
        }
      };
    }
  }
}