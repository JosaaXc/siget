import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { DegreeProgramsModule } from './degree-programs/degree-programs.module';
import { GraduationOptionsModule } from './graduation-options/graduation-options.module';
import { UserInformationModule } from './user-information/user-information.module';
import { TopicModule } from './topic/topic.module';
import { TopicRequestModule } from './topic-request/topic-request.module';
import { AcceptedTopicsModule } from './accepted-topics/accepted-topics.module';
import { FilesModule } from './files/files.module';
import { TopicDocumentCommentsModule } from './topic-document-comments/topic-document-comments.module';
import { ScheduleModule } from './schedule/schedule.module';
import { AdvisorySessionsModule } from './advisory-sessions/advisory-sessions.module';
import { SeedModule } from './seed/seed.module';
import { TopicReviewerModule } from './topic-reviewer/topic-reviewer.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true, // models will be loaded automatically (you don't need to explicitly define them)
      synchronize: true,
    }),
    CommonModule,
    AuthModule,
    DegreeProgramsModule,
    GraduationOptionsModule,
    UserInformationModule,
    TopicModule,
    TopicRequestModule,
    AcceptedTopicsModule,
    FilesModule,
    TopicDocumentCommentsModule,
    ScheduleModule,
    AdvisorySessionsModule,
    SeedModule,
    TopicReviewerModule,
  ],
})
export class AppModule {}
