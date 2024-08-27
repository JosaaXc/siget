import { BadRequestException, Body, Controller, Get, Param, ParseIntPipe, ParseUUIDPipe, Patch, Post, Query, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, studentFileNamer } from './helpers';
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

  // Get topic document id and url from uploadedBy id
  @Get('student-document/:id')
  @Auth(ValidRoles.asesor, ValidRoles.admin, ValidRoles.student, ValidRoles.titular_materia)
  async getTopicDocumentByAcceptedTopic(
    @Param('id', ParseUUIDPipe) id: string
  ){
    return this.filesService.getTopicDocumentByAcceptedTopic(id);
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

  @Patch('update-topic')
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

  @Patch('complete-chapter/:id')
  @Auth(ValidRoles.asesor)
  async completeChapter(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('chapter', ParseIntPipe ) chapter: number
  ){
    return this.filesService.completeChapter(id, +chapter);
  }

}
