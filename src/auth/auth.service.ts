import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { CreateUserDto, EmailToChangePasswordDto, LoginUserDto, ResetPasswordDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update-user.dto';
import { handleDBError } from '../common/errors/handleDBError.errors';
import { DegreeProgram } from '../degree-programs/entities/degree-program.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(DegreeProgram)
    private readonly degreeProgramRepository: Repository<DegreeProgram>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService
  ){}

  async create(createAuthDto: CreateUserDto) {

    try {

      const { password, ...userData } = createAuthDto;

      
      const user = this.userRepository.create({
        ...userData,
        password: await bcrypt.hash(password, 10)
      });
      await this.userRepository.save(user);
      // Send credentials to user by email when creating a new user
      // await this.emailService.sendCredentialsToUserByEmail( createAuthDto );
      delete user.password;
      

      return user;

    } catch (error) {
      handleDBError(error);
    }
  }

  async login(loginUserDto: LoginUserDto){

    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true }
    });

    if(!user) 
      throw new UnauthorizedException('Invalid credentials(email)');

    if( !bcrypt.compareSync(password, user.password ) )
      throw new UnauthorizedException('Invalid credentials(password)');

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    }

  }

  async forgotPassword({email}: EmailToChangePasswordDto){

    try {

      const user = await this.userRepository.findOneOrFail({ where: { email } });
  
      const token = this.getJwtToken({ id: user.id }, { expiresIn: '10m' });
      await this.emailService.sendEmailForgotPassword(user, token);

      return { message: 'Email sent successfully' };

    } catch (error) {
      handleDBError(error);
    }

  }

  async resetPassword (token: string, { password }: ResetPasswordDto) {

    try {

      const { id } = await this.jwtService.verify(token) as JwtPayload;
      await this.userRepository.update(id, { password: await bcrypt.hash(password, 10) });
      return { message: 'Password updated successfully' };

    } catch (error) {
      handleDBError(error);
    }

  }

  private getJwtToken(payload: JwtPayload, options?: JwtSignOptions) {
    return this.jwtService.sign(payload, options);
  }

  async getUsers(paginationDto: PaginationDto) {
    const { limit = 15 , offset = 0 } = paginationDto;
    return await this.userRepository.find({ 
      skip: offset, 
      take: limit 
    });
  }

  async getUser(id: string) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    try {
      await this.userRepository.update(id, updateUserDto);
      const updatedUser = await this.userRepository.findOne({ where: { id } });
      return updatedUser;
    } catch (error) {
      handleDBError(error);
    }
  }

  async deleteUser(id: string) {
    
    const user = await this.userRepository.findOne({ where: { id: id }, relations: ['degreePrograms'] });
    if (!user) 
      throw new BadRequestException('User not found');

    try {
      for (const degreeProgram of user.degreePrograms) {
        await this.degreeProgramRepository.createQueryBuilder()
          .relation(DegreeProgram, 'users')
          .of(degreeProgram.id)
          .remove(id);
      }
    
      await this.userRepository.delete(id);
    
      return { message: 'User deleted successfully' };
    } catch (error) {
      handleDBError(error);
    }
  }
}
