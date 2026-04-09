import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigModule} from "@nestjs/config";
import {User} from "./modules/users/user.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsersModule} from "./modules/users/users.module";
import {BotService} from "./services/bot.service";
import {GroupsModule} from "./modules/groups/groups.module";
import {Group, GroupUser} from "./modules/groups/group.entity";
import {RequireAdminDecorator} from "./decorators/requireAdmin.decorator";
import {RequireConnectedGroupDecorator} from "./decorators/requireConnectedGroup.decorator";

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
      entities: [User, Group, GroupUser],
      synchronize: process.env.NODE_ENV === 'development',
    }),
    UsersModule,
    GroupsModule,
  ],
  controllers: [AppController],
  providers: [AppService, BotService, RequireAdminDecorator, RequireConnectedGroupDecorator],
})
export class AppModule {
}
