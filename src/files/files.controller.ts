import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, fileNamer } from './helpers';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) {}


  @Get('document/:imageName')
  async findDocument(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ){
    const path = await this.filesService.getStaticDocument(imageName);
    res.sendFile( path );
  }

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter, 
    limits: { fileSize: 1024 * 1024 * 10 }, // 10mb
    storage: diskStorage({
      destination: './static/documents/',
      filename: fileNamer
    })
  }))
  uploadFile( 
    @UploadedFile() file: Express.Multer.File 
  ) {

    if(!file) throw new BadRequestException('Make sure the file is a document(doc, docx, pdf)')

    const secureUrl = `${ this.configService.get('HOST_API') }/files/document/${ file.filename }`
    return { secureUrl }
  }

}
