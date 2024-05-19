import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { existsSync } from 'fs';
import { join } from 'path';

import { TopicDocument } from './entities/topic-document.entity';
import { handleDBError } from '../common/errors/handleDBError.errors';

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

  async uploadFile(file: Express.Multer.File, hostApi: string) {
    const secureUrl = `${ hostApi }/files/document/${ file.filename }`
    return secureUrl;
  }

  async saveTopicDocument( acceptedTopicId: string , secureUrl: string){
    try {
      
      const newTopicDocument = this.topicDocumentRepository.create({
        acceptedTopic: { id: acceptedTopicId },
        url: secureUrl
      });

      return await this.topicDocumentRepository.save(newTopicDocument);

    } catch (error) {
      handleDBError(error);
    }
  }

  async updateTopicDocument( topicDocument: string , secureUrl: string){
    try {

      await this.topicDocumentRepository.update( topicDocument, { url: secureUrl });
      return await this.topicDocumentRepository.findOneOrFail({ where: { id: topicDocument }});

    } catch (error) {
      handleDBError(error);
    }
  }
}
