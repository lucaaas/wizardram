import {Bot, Context, Filter} from "grammy";


export class BotService {
    private bot: Bot;

    constructor() {
        this.bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);
        this.addListeners();
        this.bot.start();
    }

    public static init(): void {
        new BotService();
    }

    private addListeners(): void {
        this.bot.on('message', (info) => console.log(info.msg))
        this.bot.command('connect', )
    }

    private handleCommand(command: string): void {

    }

    private handleMessage(from, chat, chatId): void {
        console.log(JSON.stringify(from.getAuthor()));
    }


}