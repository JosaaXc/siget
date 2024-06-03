import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserInformationService } from './user-information.service';
import { CreateUserInformationDto } from './dto/create-user-information.dto';
import { UpdateUserInformationDto } from './dto/update-user-information.dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';

@Controller('user-information')
@Auth()
export class UserInformationController {
  constructor(private readonly userInformationService: UserInformationService) {}

  @Post()
  create(
    @Body() createUserInformationDto: CreateUserInformationDto,
    @GetUser() user: User
  ) {
    return this.userInformationService.create(createUserInformationDto, user.id);
  }

  //TODO: Decide if this route should be protected by a role admin
  @Get()
  findAll() {
    return this.userInformationService.findAll();
  }

  @Get('by-user')
  findOne(
    @GetUser() user: User
  ) {
    return this.userInformationService.findOne(user.id);
  }

  // find user information by id
  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.userInformationService.findOneById(id);
  }

  @Patch()
  update(
    @GetUser() user: User, 
    @Body() updateUserInformationDto: UpdateUserInformationDto
  ) {
    return this.userInformationService.update(user.id, updateUserInformationDto);
  }

}
