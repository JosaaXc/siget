import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { existsSync, renameSync, unlinkSync } from 'fs';
import { join } from 'path';

import { TopicDocument } from './entities/topic-document.entity';
import { handleDBError } from '../common/errors/handleDBError.errors';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class FilesService {

  constructor(
    @InjectRepository(TopicDocument)
    private readonly topicDocumentRepository: Repository<TopicDocument>
  ){}

  async getStaticDocument( imageName: string ){

    const path = join(__dirname, '../../static/documents', imageName);

    if( !existsSync(path) ) throw new BadRequestException('Document not found');

    return path;

  }

  async findTopicDocumentById( id: string ){
    try {
      return await this.topicDocumentRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      handleDBError(error);
    }
  }

  async getStudentTopicDocuments(user: User) {
    try {
      return await this.topicDocumentRepository.find({ where: { uploadedBy: user } });
    } catch (error) {
      handleDBError(error);
    }
  }

  async getTopicDocumentByAcceptedTopic( id: string ){
    try {
      return await this.topicDocumentRepository.findOneOrFail({ where: { acceptedTopic: { id } } });
    } catch (error) {
      handleDBError(error);
    }
  }

  async uploadFile(file: Express.Multer.File, hostApi: string) {
    const secureUrl = `${ hostApi }/files/document/${ file.filename }`
    return secureUrl;
  }

  async saveTopicDocument( acceptedTopicId: string , secureUrl: string, user: User){
    try {
      
      const newTopicDocument = this.topicDocumentRepository.create({
        acceptedTopic: { id: acceptedTopicId },
        url: secureUrl,
        uploadedBy: user
      });

      return await this.topicDocumentRepository.save(newTopicDocument);

    } catch (error) {
      handleDBError(error);
    }
  }

  async updateTopicDocument(topicDocumentId: string, secureUrl: string, hostApi: string, originalFilename: string) {
    const topicDocument = await this.findTopicDocumentById(topicDocumentId);
  
    try {
      const urlParts = topicDocument.url.split('/');
      const filenameWithExtension = urlParts[urlParts.length - 1];
      const acceptedTopicId = filenameWithExtension.split('.')[0];
      const extension = secureUrl.split('.').pop();
      const newFilename = `${acceptedTopicId}.${extension}`;
      
      const newSecureUrl = `${hostApi}/files/document/${newFilename}`;
  
      // Renombrar el archivo en el sistema de archivos
      const oldPath = join(__dirname, '../../static/documents', originalFilename);
      const newPath = join(__dirname, '../../static/documents', newFilename);
      renameSync(oldPath, newPath);
  
      await this.topicDocumentRepository.update( 
        topicDocumentId, 
        { 
          url: newSecureUrl,
          updatedAt: new Date()
        }
      );
      return await this.topicDocumentRepository.findOneOrFail({ where: { id: topicDocumentId }});
    } catch (error) {
      handleDBError(error);
    }
  }

  async completeChapter( id: string, chapterNumber: number ){
    try {
      const topicDocument = await this.topicDocumentRepository.preload({ id, chapters: chapterNumber });
      await this.topicDocumentRepository.save(topicDocument);
      return await this.topicDocumentRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      handleDBError(error);
    }
  }
}
