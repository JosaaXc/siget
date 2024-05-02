import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { DegreeProgramsModule } from './degree-programs/degree-programs.module';
import { GraduationOptionsModule } from './graduation-options/graduation-options.module';
import { UserInformationModule } from './user-information/user-information.module';
import { TopicModule } from './topic/topic.module';

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
  ],
})
export class AppModule {}
