import { Module } from '@nestjs/common';
import { GraduationOptionsService } from './graduation-options.service';
import { GraduationOptionsController } from './graduation-options.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { GraduationOption } from './entities/graduation-option.entity';

@Module({
  controllers: [GraduationOptionsController],
  providers: [GraduationOptionsService],
  imports: [
    AuthModule, 
    TypeOrmModule.forFeature([
      GraduationOption
    ])
  ]
})
export class GraduationOptionsModule {}
