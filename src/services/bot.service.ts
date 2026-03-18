import {Injectable, OnModuleInit} from "@nestjs/common";
import {Bot, CommandContext, Context} from "grammy";
import {UsersService} from "../modules/users/users.service";
import {User} from "../modules/users/user.entity";


@Injectable()
export class BotService implements OnModuleInit {
  private bot: Bot;

  constructor(private userService: UsersService) {
    this.bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);
    this.addListeners();
  }

  async onModuleInit() {
    await this.bot.start();
    this.bot.catch((err) => {
      console.log(err)
    });
  }

  private addListeners(): void {
    this.bot.command('connect', this.connect);
    this.bot.command('id', this.getChatId);
  }

  
  private async connect(ctx: CommandContext<Context>): Promise<void> {
    if (ctx.chat.type === 'private') {
      if (ctx.match) {
        try {
          const group = await ctx.api.getChat(ctx.match)
          const groupId: number = group.id;

          const memberStatus: String = await this.getMemberRole(ctx.chatId, groupId);
          const botStatus: String = await this.getMemberRole(ctx.me.id, groupId);
          if (botStatus === 'administrator' && (memberStatus === 'creator' || memberStatus === 'administrator')) {
            let user: User;
            try {
              user = await this.userService.getByTelegramId(ctx.chatId);
            } catch (e) {
              user = new User();
              user.telegramId = ctx.chatId;
            }

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

  private async getMemberRole(memberId: number, groupId: number | string): Promise<String> {
    const member = await this.bot.api.getChatMember(groupId, memberId);
    if (member) {
      return member.status;
    } else {
      return 'none'
    }
  }

  private getChatId(ctx): void {
    ctx.reply(`O id é ${ctx.chatId}`);
  }

  private handleCommand(command: string): void {

  }

  private handleMessage(from, chat, chatId): void {
    console.log(JSON.stringify(from.getAuthor()));
  }


}