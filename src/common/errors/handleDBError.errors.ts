import { BadRequestException, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { QueryFailedError } from 'typeorm';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

export function handleDBError(error: any): never {
  
  if (error.code === '23505') 
    throw new BadRequestException(error.detail);

  if (error instanceof EntityNotFoundError) 
    throw new NotFoundException('The requested resource could not be found');
  
  if (error.code === '23503') // PostgreSQL foreign key violation error code
    throw new BadRequestException(error.detail);
    
  if (error.code === '23502')
    throw new BadRequestException(error.detail);

  if (error instanceof TokenExpiredError) 
    throw new UnauthorizedException('Token has expired');

  if (error instanceof JsonWebTokenError) 
    throw new UnauthorizedException('Invalid token');

  if( error.code === '22P02')
    throw new BadRequestException(error.detail);

  if(error.code === '42883')
    throw new BadRequestException(error.detail);
  
  console.log(error);
  throw new InternalServerErrorException('Something went wrong');

}