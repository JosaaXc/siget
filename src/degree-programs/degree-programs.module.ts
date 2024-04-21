import { Module, forwardRef } from '@nestjs/common';
import { DegreeProgramsService } from './degree-programs.service';
import { DegreeProgramsController } from './degree-programs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DegreeProgram } from './entities/degree-program.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [DegreeProgramsController],
  providers: [DegreeProgramsService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([DegreeProgram])
  ],
  exports: []
})
export class DegreeProgramsModule {}
