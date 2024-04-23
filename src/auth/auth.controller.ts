import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { Auth, GetUser, RawHeaders } from './decorators';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createAuthDto: CreateUserDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  // @Get('example')
  // @Auth(ValidRoles.admin) // use this to protect the route
  // // @Auth() // use this to protect the route but without any role
  // privateRoute3(
  //   @GetUser() user: User
  // ){
  //   return {
  //     message: 'This is a private route',
  //     user
  //   }
  // }

  @Get('users')
  getUsers(
    @Query() paginationDto: PaginationDto
  ) {
    return this.authService.getUsers(paginationDto);
  }
  
  @Get('users/:id')
  getUser(@Param('id') id: string) {
    return this.authService.getUser(id);
  }
 
  @Patch('users/:id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.updateUser(id, updateUserDto);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.authService.deleteUser(id);
  }
}
