import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { AuthModule } from '../auth/auth.module';
import { UserInformation } from '../user-information/entities/user-information.entity';

@Module({
  controllers: [ScheduleController],
  providers: [ScheduleService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      Schedule,
      UserInformation
    ])
  ]
})
export class ScheduleModule {}
