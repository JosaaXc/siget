import { Module } from '@nestjs/common';
import { UserInformationService } from './user-information.service';
import { UserInformationController } from './user-information.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInformation } from './entities/user-information.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [UserInformationController],
  providers: [UserInformationService],
  imports: [ 
    AuthModule, 
    TypeOrmModule.forFeature([
      UserInformation
    ])
  ] 
})
export class UserInformationModule {}
