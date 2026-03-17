import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {BotService} from "./services/bot.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);

  BotService.init();
}
bootstrap();
