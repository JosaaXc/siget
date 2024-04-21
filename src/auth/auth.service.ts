import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update-user.dto';
import { handleDBError } from 'src/common/errors/handleDBError.errors';
import { DegreeProgram } from 'src/degree-programs/entities/degree-program.entity';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(DegreeProgram)
    private readonly degreeProgramRepository: Repository<DegreeProgram>,
    private readonly jwtService: JwtService
  ){}

  async create(createAuthDto: CreateUserDto) {

    try {

      const { password, ...userData } = createAuthDto;
      const user = this.userRepository.create({
        ...userData,
        password: await bcrypt.hash(password, 10)
      });
      await this.userRepository.save(user);
      delete user.password;

      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
      }

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

  private getJwtToken( payload: JwtPayload ){

    const token = this.jwtService.sign(payload);
    return token;

  }

  async getUsers() {
    return await this.userRepository.find();
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
