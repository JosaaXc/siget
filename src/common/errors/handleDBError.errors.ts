import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

export function handleDBError(error: any): never {
  
  if (error.code === '23505') 
    throw new BadRequestException(error.detail);

  if (error instanceof EntityNotFoundError) 
    throw new NotFoundException('The requested resource could not be found');
  
  if (error.code === '23503') // PostgreSQL foreign key violation error code
    throw new BadRequestException(error.detail);
  
  console.log(error);
  throw new InternalServerErrorException('Something went wrong');

}