import { BadRequestException, Body, Controller, Get, Param, ParseUUIDPipe, Post, Query, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, fileNamer, studentFileNamer } from './helpers';
import { Response, Request } from 'express'; // Add Request import
import { ConfigService } from '@nestjs/config';
import { Auth, GetUser } from '../auth/decorators';
import { User } from '../auth/entities/user.entity';
import { ValidRoles } from '../auth/interfaces';

@Controller('files')
export class FilesController {
  
  private hostApi: string;

  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) {
    this.hostApi = this.configService.get('HOST_API');
  }

  @Get('document/:imageName')  
  async findDocument(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ){
    const path = await this.filesService.getStaticDocument(imageName);
    res.sendFile( path );
  }

  @Get('my-documents')
  @Auth(ValidRoles.student)
  async getStudentDocuments(
    @GetUser() user: User
  ){
    return this.filesService.getStudentTopicDocuments(user);
  }

  @Post('upload-titulation')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter, 
    limits: { fileSize: 1024 * 1024 * 10 }, // 10mb
    storage: diskStorage({
      destination: './static/documents/',
      filename: fileNamer
    })
  }))
  uploadGeneralFile(@UploadedFile() file: Express.Multer.File) {
    if(!file) throw new BadRequestException('Make sure the file is a document(doc, docx, pdf)')
    return this.filesService.uploadFile(file, this.hostApi);
  }

  @Post('upload-topic')
  @Auth(ValidRoles.student)
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter, 
    limits: { fileSize: 1024 * 1024 * 10 }, // 10mb
    storage: diskStorage({
      destination: './static/documents/',
      filename: studentFileNamer // Aquí se usa el ID del estudiante
    })
  }))
  async uploadStudentFile(
    @GetUser() user: User,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Query('acceptedTopicId', ParseUUIDPipe ) acceptedTopicId: string
  ) {
    req.user = user;
    if(!file) throw new BadRequestException('Make sure the file is a document(doc, docx, pdf)')
    const secureUrl = await this.filesService.uploadFile(file, this.hostApi);
    return this.filesService.saveTopicDocument( acceptedTopicId, secureUrl, user );
  }

  @Post('update-topic')
  @Auth(ValidRoles.student)
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter, 
    limits: { fileSize: 1024 * 1024 * 10 }, // 10mb
    storage: diskStorage({
      destination: './static/documents/',
      filename: studentFileNamer // Aquí se usa el ID del estudiante
    })
  }))
  async updateStudentFile(
    @GetUser() user: User,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Query('topic-document', ParseUUIDPipe ) topicDocument: string
  ) {
    req.user = user;
    if(!file) throw new BadRequestException('Make sure the file is a document(doc, docx, pdf)')
    const secureUrl = await this.filesService.uploadFile(file, this.hostApi);
    return this.filesService.updateTopicDocument( topicDocument, secureUrl );
  }

}
