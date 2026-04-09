import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Group, GroupUser} from "./group.entity";
import {GroupsService} from "./groups.service";

@Module({
  imports: [TypeOrmModule.forFeature([Group, GroupUser])],
  providers: [GroupsService],
  exports: [GroupsService],
})
export class GroupsModule {
}