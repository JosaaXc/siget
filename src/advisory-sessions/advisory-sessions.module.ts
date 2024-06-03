import { Module } from '@nestjs/common';
import { AdvisorySessionsService } from './advisory-sessions.service';
import { AdvisorySessionsController } from './advisory-sessions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdvisorySession } from './entities/advisory-session.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [AdvisorySessionsController],
  providers: [AdvisorySessionsService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      AdvisorySession
    ]),
  ]
})
export class AdvisorySessionsModule {}
