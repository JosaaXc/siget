import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, EmailToChangePasswordDto, LoginUserDto, ResetPasswordDto } from './dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { Auth, GetUser } from './decorators';
import { User } from './entities/user.entity';
import { ValidRoles } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Auth(ValidRoles.admin, ValidRoles.titular_materia, ValidRoles.administrativo)
  createUser(@Body() createAuthDto: CreateUserDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('forgot-password')
  @Auth()
  async forgotPassword(
    @Body() emailToChangePasswordDto: EmailToChangePasswordDto
  ) {
    return await this.authService.forgotPassword(emailToChangePasswordDto);
  }

  @Patch('reset-password/:token')
  @Auth()
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Param('token') token: string
  ) {
    return await this.authService.resetPassword(token,resetPasswordDto);
  }

  @Get('users')
  @Auth()
  getUsers(
    @Query() paginationDto: PaginationDto
  ) {
    return this.authService.getUsers(paginationDto);
  }
  
  @Get('users/:id')
  @Auth()
  getUser(@Param('id') id: string) {
    return this.authService.getUser(id);
  }

  @Get('refresh-token')
  @Auth()
  refreshToken(
    @GetUser() user: User,
  ) {
    return this.authService.refreshToken(user);
  }
 
  @Patch('users/:id')
  @Auth()
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.updateUser(id, updateUserDto);
  }

  @Delete('users/:id')
  @Auth(ValidRoles.admin, ValidRoles.titular_materia, ValidRoles.administrativo)
  deleteUser(@Param('id') id: string) {
    return this.authService.deleteUser(id);
  }
}
