import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicDocument } from './entities/topic-document.entity';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [
    TypeOrmModule.forFeature([
      TopicDocument
    ]),
    ConfigModule,
    AuthModule
  ]
})
export class FilesModule {}
