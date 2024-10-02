import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AbandonedTopic } from './entities/abandoned-topic.entity';
import { DegreeProgramDto } from '../accepted-topics/dto/degree-program.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { UserInformation } from '../user-information/entities/user-information.entity';

@Injectable()
export class AbandonedTopicService {

    constructor(
        @InjectRepository(AbandonedTopic)
        private readonly abandonedTopicRepository: Repository<AbandonedTopic>,
        @InjectRepository(UserInformation)
        private readonly userInformationRepository: Repository<UserInformation>,
    ) {}

    async findByDegreeProgram({ degree }:  DegreeProgramDto, { limit = 10, offset = 0 }: PaginationDto) {
        const abandonedTopics = await this.abandonedTopicRepository.createQueryBuilder('abandonedTopic')
        .leftJoinAndSelect('abandonedTopic.acceptedBy', 'acceptedBy')
        .leftJoinAndSelect('abandonedTopic.degreeProgram', 'degreeProgram')
        .leftJoinAndSelect('abandonedTopic.graduationOption', 'graduationOption')
        .where('abandonedTopic.degreeProgramId IN (:...degree)', { degree })
        .skip(offset)
        .take(limit)
        .getMany();

        const topicsWithUserInfo = await Promise.all(abandonedTopics.map(async (topic) => {
            const userInfo = await this.getUserInformation(topic.acceptedBy.id);
            return {
            ...topic,
            acceptedBy: {
                ...topic.acceptedBy,
                ...userInfo,
            },
            };
        }));
        return topicsWithUserInfo;
    }

    private async getUserInformation(userId: string) {
        return await this.userInformationRepository.createQueryBuilder("userInformation")
          .innerJoin("userInformation.user", "user", "user.id = :id", { id: userId })
          .select(['userInformation.name', 'userInformation.fatherLastName', 'userInformation.motherLastName'])
          .getOne();
    }

}
