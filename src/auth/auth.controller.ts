import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, EmailToChangePasswordDto, LoginUserDto, ResetPasswordDto } from './dto';
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

  @Post('forgot-password')
  async forgotPassword(
    @Body() emailToChangePasswordDto: EmailToChangePasswordDto
  ) {
    return await this.authService.forgotPassword(emailToChangePasswordDto);
  }

  @Patch('reset-password/:token')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Param('token') token: string
  ) {
    return await this.authService.resetPassword(token,resetPasswordDto);
  }

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
