import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigModule} from "@nestjs/config";
import {User} from "./modules/users/user.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsersModule} from "./modules/users/users.module";
import {BotService} from "./services/bot.service";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User],
      synchronize: process.env.NODE_ENV === 'development',
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, BotService],
})
export class AppModule {
}
