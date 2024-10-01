import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { existsSync } from 'fs';
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

  async getStudentTopicDocuments(user: User) {
    try {
      const documents = await this.topicDocumentRepository.find({ where: { uploadedBy: user } });
      return documents.map(({ id, acceptedTopic, url, uploadedBy, uploadedAt, updatedAt, chapters }) => ({
        id,
        acceptedTopicId: acceptedTopic.id,
        url,
        uploadedBy: uploadedBy.id,
        uploadedAt,
        updatedAt,
        chapters,
      }));
    } catch (error) {
      handleDBError(error);
    }
  }

  async getTopicDocumentByAcceptedTopic( id: string ){
    try {
      const document = await this.topicDocumentRepository.findOneOrFail({ where: { acceptedTopic: { id } } });
      return { 
        id: document.id, 
        url: document.url, 
        updatedAt: document.updatedAt,
        uploadedAt: document.uploadedAt,
        acceptedTopicId: document.acceptedTopic.id,
        uploadedBy: document.uploadedBy.id,
      }
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

  async updateTopicDocument( topicDocument: string , secureUrl: string){
    try {
      await this.topicDocumentRepository.update( 
        topicDocument, 
        { 
          url: secureUrl,
          updatedAt: new Date()
        }
      );
      return await this.topicDocumentRepository.findOneOrFail({ where: { id: topicDocument }});
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
