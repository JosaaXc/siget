import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Not, Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { CreateUserDto, EmailToChangePasswordDto, LoginUserDto, ResetPasswordDto, UserWithRoleAndDegreeDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update-user.dto';
import { handleDBError } from '../common/errors/handleDBError.errors';
import { DegreeProgram } from '../degree-programs/entities/degree-program.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { EmailService } from '../email/email.service';
import { UserInformation } from '../user-information/entities/user-information.entity';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(DegreeProgram)
    private readonly degreeProgramRepository: Repository<DegreeProgram>,
    @InjectRepository(UserInformation)
    private readonly userInformationRepository: Repository<UserInformation>,
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
      select: { email: true, password: true, roles:true, id: true }
    });
    
    if(!user) 
      throw new UnauthorizedException('Invalid credentials(email)');
    
    if( !bcrypt.compareSync(password, user.password ) )
      throw new UnauthorizedException('Invalid credentials(password)');
    
    delete user.password;
    const token = this.getJwtToken({ id: user.id }, { expiresIn: '1d' });
    const userSearched = await this.getUser(user.id);
    return { ...userSearched , token };
    
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

  async changePassword( {newPassword, oldPassword}: ChangePasswordDto, user: User ) {
    const userLocated = await this.userRepository.findOneOrFail({ 
      where: { id: user.id },
      select: ['id', 'password']
    });
    if( !bcrypt.compareSync( oldPassword , userLocated.password ) )
      throw new UnauthorizedException('La contraseña actual no coincide');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(user.id, { password: hashedPassword });
    return { message: 'Password updated successfully' };
  }

  private getJwtToken(payload: JwtPayload, options?: JwtSignOptions) {
    return this.jwtService.sign(payload, options);
  }

  async refreshToken(user: User) {
    const token = this.getJwtToken({ id: user.id }, { expiresIn: '1d' });
    const userLocated = await this.getUser(user.id);
    return { ...userLocated, token };
  }

  async getUsers(paginationDto: PaginationDto, user: User) {
    try {
      const { limit = 15 , offset = 0 } = paginationDto;
      const users = await this.userRepository.find({
        where: { id: Not(user.id) },
        skip: offset,
        take: limit,
      });
      return await this.getUsersInformation(users);
    } catch (error) {
      handleDBError(error);
    }
  }

  async getUsersWithRoleAndDegree(paginationDto: PaginationDto, userWithRoleAndDegreeDto: UserWithRoleAndDegreeDto, user: User) {
    const { limit = 15, offset = 0 } = paginationDto;
    const { role, degree } = userWithRoleAndDegreeDto;
    try {
      const users = await this.userRepository.createQueryBuilder('user')
        .innerJoin('user.degreePrograms', 'degreeProgram')
        .where(':role = ANY(user.roles)', { role })
        .andWhere('degreeProgram.id IN (:...degree)', { degree })
        .andWhere('user.id != :userId', { userId: user.id }) // Excluir al usuario actual
        .skip(offset)
        .take(limit)
        .getMany();

      return await this.getUsersInformation(users);
    } catch (error) {
      handleDBError(error);
    }
  }

  async getUsersInformation(users: User[]) {
    const usersWithInformation = await Promise.all(users.map(async (user) => {
      const userInformation = await this.userInformationRepository
        .createQueryBuilder('userInformation')
        .select(['userInformation.name', 'userInformation.fatherLastName', 'userInformation.motherLastName'])
        .where('userInformation.userId = :userId', { userId: user.id })
        .getOne();
      return { ...user, userInformation };
    }));
    return usersWithInformation;
  }

  async getUser(id: string) {
    try {
      const user = await this.userRepository.findOneOrFail({ where: { id } });
      const userInformation = await this.userInformationRepository
        .createQueryBuilder('userInformation')
        .where('userInformation.userId = :userId', { userId: id })
        .getOne();
      const userDegreePrograms = await this.degreeProgramRepository
        .createQueryBuilder('degreeProgram')
        .innerJoin('degreeProgram.users', 'user')
        .where('user.id = :userId', { userId: id })
        .getMany();
      
      return { user, userInformation, userDegreePrograms };
    } catch (error) {
      handleDBError(error);
    }
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
