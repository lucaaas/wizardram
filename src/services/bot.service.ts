import {Injectable, OnModuleInit} from "@nestjs/common";
import {Bot, CommandContext, Context} from "grammy";
import {UsersService} from "../modules/users/users.service";
import {User} from "../modules/users/user.entity";
import {GroupsService} from "../modules/groups/groups.service";
import {Chat, User as GrammyUser} from "grammy/types";

/**
 * Service class for managing a Telegram bot using the Grammy library.
 * Handles bot initialization, command listeners, and user interactions.
 */
@Injectable()
export class BotService implements OnModuleInit {
  private bot: Bot;

  /**
   * Constructor for BotService.
   * Initializes the bot with the token and sets up listeners.
   * @param userService - Injectable service for user-related operations.
   * @param groupService - Injectable service for group-related operations.
   */
  constructor(private userService: UsersService, private groupService: GroupsService) {
    this.bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);
    this.addListeners();
  }

  /**
   * Lifecycle hook called after the module has been initialized.
   * Starts the bot and sets up error handling.
   */
  async onModuleInit(): Promise<void> {
    await this.bot.start();
    this.bot.catch((err) => {
      console.log(err)
    });
  }

  /**
   * Adds command listeners to the bot.
   */
  private addListeners(): void {
    this.bot.command('connect', this.connect);
    this.bot.command('id', this.getChatId);

    this.bot.on('message', ctx => this.countMessage(ctx.from, ctx.chat));
  }

  /**
   * Handles the 'connect' command.
   * Connects the user to a specified group if the user and bot are administrators.
   * @param ctx - The command context from Grammy.
   */
  private async connect(ctx: CommandContext<Context>): Promise<void> {
    if (ctx.chat.type === 'private') {
      if (ctx.match) {
        try {
          const group = await ctx.api.getChat(ctx.match)
          const groupId: number = group.id;

          const memberStatus: String = await this.getMemberRole(ctx.chatId, groupId);
          const botStatus: String = await this.getMemberRole(ctx.me.id, groupId);
          if (botStatus === 'administrator' && (memberStatus === 'creator' || memberStatus === 'administrator')) {
            const user: User = await this.userService.getByTelegramIdOrCreate(ctx.chatId);
            user.connectedGroupId = groupId;
            await this.userService.save(user);

            ctx.reply(`Conectado ao grupo _${group.title}_ com sucesso\\!`, {parse_mode: 'MarkdownV2'});
          } else {
            ctx.reply('Para conectar você e o bot precisam ser administradores do grupo.')
          }
        } catch (e) {
          ctx.reply('Não consegui encontrar o grupo. Verifique se o username está correto e se o bot tem acesso ao grupo.');
        }
      } else {
        ctx.reply('Preciso que você me envie o código do grupo ou o username.')
      }
    }
  }

  /**
   * Gets the member role in a group.
   * @param memberId - The ID of the member.
   * @param groupId - The ID of the group.
   * @returns The status of the member as a string.
   */
  private async getMemberRole(memberId: number, groupId: number | string): Promise<String> {
    const member = await this.bot.api.getChatMember(groupId, memberId);
    if (member) {
      return member.status;
    } else {
      return 'none'
    }
  }

  /**
   * Handles the 'id' command.
   * Replies with the chat ID.
   * @param ctx - The context object.
   */
  private getChatId(ctx: CommandContext<Context>): void {
    ctx.reply(`O id é ${ctx.chatId}`);
  }

  /**
   * Counts user's message.
   * @param from - The sender of the message.
   * @param chat - Chat where the message was sent.
   */
  private async countMessage(from: GrammyUser, chat: Chat.PrivateChat | Chat.GroupChat | Chat.SupergroupChat): Promise<void> {
    if (chat.type !== 'private') {
      const user: User = await this.userService.getByTelegramIdOrCreate(from.id);
      await this.groupService.addOneOnQuantityMessages(user, chat.id);
    }
  }
}
