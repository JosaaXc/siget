import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { Repository } from 'typeorm';
import { handleDBError } from '../common/errors/handleDBError.errors';
import { User } from '../auth/entities/user.entity';
import { UserInformation } from '../user-information/entities/user-information.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { CreateScheduleDto, RequestStatusDto, UpdateScheduleDto } from './dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ScheduleService {

  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    @InjectRepository(UserInformation)
    private readonly userInformationRepository: Repository<UserInformation>,
  ) {}

  private async getUserInformation(userId: string) {
    return await this.userInformationRepository.createQueryBuilder('user_information')
      .leftJoinAndSelect('user_information.user', 'user')
      .select(['user.id', 'user_information.name', 'user_information.fatherLastName', 'user_information.motherLastName'])
      .where('user.id = :userId', {userId})
      .getOne();
  }

  private async getParticipantsInformation(participantIds: string[]) {
    return await this.userInformationRepository.createQueryBuilder('user_information')
      .leftJoinAndSelect('user_information.user', 'user')
      .select(['user.id', 'user_information.name', 'user_information.fatherLastName', 'user_information.motherLastName'])
      .where('user.id IN (:...participantIds)', {participantIds})
      .getMany();
  }

  async create(createScheduleDto: CreateScheduleDto, user: User) {
    const {participants, invitee, ...createSchedule} = createScheduleDto;
    try {
      const schedule = this.scheduleRepository.create({
        ...createSchedule,
        requester: {id: user.id},
        invitee: {id: invitee},
        participants: participants.map((participant) => ({id: participant})),
      });

      const savedSchedule = await this.scheduleRepository.save(schedule);
      // search user information for the requester, invitee and participants
      const requester = await this.getUserInformation(user.id);
      const inviteeInfo = await this.getUserInformation(invitee);
      const participantsInfo = await this.getParticipantsInformation(participants);

      const participantsWithIds = participants.map((participantId, index) => ({
        id: participantId,
        ...participantsInfo[index],
      }));
      
      return {
        ...savedSchedule,
        requester: requester,
        invitee: inviteeInfo,
        participants: participantsWithIds,
      };
      
    } catch (error) {
      handleDBError(error);
    }
  }

  async getSchedulesByUser( paginationDto: PaginationDto, where: string, user: User){
    try {
      const schedules = await this.scheduleRepository.createQueryBuilder('schedule')
        .leftJoinAndSelect('schedule.requester', 'requester')
        .leftJoinAndSelect('schedule.invitee', 'invitee')
        .leftJoinAndSelect('schedule.participants', 'participants')
        .select([
          'schedule.id',
          'schedule.topic',
          'schedule.location',
          'schedule.date',
          'schedule.time',
          'schedule.status',
          'requester.id',
          'invitee.id',
          'participants.id',
        ])
        .where(where, {userId: user.id})
        .skip( paginationDto.offset )
        .take( paginationDto.limit )
        .getMany();

      return schedules;
    } catch (error) {
      handleDBError(error);
    }
  }

  async getSchedulesByStatus( paginationDto: PaginationDto, where: string, status: RequestStatusDto, user: User){
    try {
      const schedules = await this.scheduleRepository.createQueryBuilder('schedule')
        .leftJoinAndSelect('schedule.requester', 'requester')
        .leftJoinAndSelect('schedule.invitee', 'invitee')
        .leftJoinAndSelect('schedule.participants', 'participants')
        .select([
          'schedule.id',
          'schedule.topic',
          'schedule.location',
          'schedule.date',
          'schedule.time',
          'schedule.status',
          'requester.id',
          'invitee.id',
          'participants.id',
        ])
        .where(where, {userId: user.id})
        .andWhere('schedule.status = :status', {status: status.status})
        .skip( paginationDto.offset )
        .take( paginationDto.limit )
        .getMany();
        return schedules;
    } catch (error) {
      handleDBError(error);
    }
  }

  async findMyRequest(user: User, { limit = 10, offset = 0 }: PaginationDto) {
    try {
      const schedules = await this.getSchedulesByUser({limit, offset}, 'requester.id = :userId OR participants.id = :userId', user);

      if(schedules.length === 0) return {schedules: []};

      const participantsIds = schedules.map((schedule) => schedule.participants.map((participant) => participant.id)).flat();

      const inviteeInfo = await this.getUserInformation(schedules[0].invitee.id);
      const requesterInfo = await this.getUserInformation(schedules[0].requester.id);
      const participantsInfo = await this.getParticipantsInformation(participantsIds);

      return {
        schedules: schedules.map((schedule) => {
          return {
            ...schedule,
            requester: requesterInfo,
            invitee: inviteeInfo,
            participants: participantsInfo,
          };
        })
      }
    } catch (error) {
      handleDBError(error);
    }
  }

  async findMyPetition(user: User, { limit = 10, offset = 0 }: PaginationDto) {
    try {

      const schedules = await this.getSchedulesByUser({limit, offset}, 'invitee.id = :userId', user);

      if(schedules.length === 0) return {schedules: []};

      const participantsIds = schedules.map((schedule) => schedule.participants.map((participant) => participant.id)).flat();

      const requesterInfo = await this.getUserInformation(schedules[0].requester.id);
      const participantsInfo = await this.getParticipantsInformation(participantsIds);

      delete schedules[0].invitee;
      return {
        schedules: schedules.map((schedule) => {
          return {
            ...schedule,
            requester: requesterInfo,
            participants: participantsInfo,
          };
        })
      }
    } catch (error) {
      handleDBError(error);
    }
  }

  async findMyRequestByStatus(user: User, { limit = 10, offset = 0 }: PaginationDto, ScheduleStatusDto: RequestStatusDto) {
    try {

      const schedules = await this.getSchedulesByStatus({limit, offset}, 'requester.id = :userId OR participants.id = :userId', ScheduleStatusDto, user);

      if(schedules.length === 0) return {schedules: []};

      const participantsIds = schedules.map((schedule) => schedule.participants.map((participant) => participant.id)).flat();

      const inviteeInfo = await this.getUserInformation(schedules[0].invitee.id);
      const participantsInfo = await this.getParticipantsInformation(participantsIds);

      return {
        schedules: schedules.map((schedule) => {
          return {
            ...schedule,
            invitee: inviteeInfo,
            participants: participantsInfo,
          };
        })
      }
    } catch (error) {
      handleDBError(error);
    }
  }

  async findMyPetitionByStatus(user: User, { limit = 10, offset = 0 }: PaginationDto, ScheduleStatusDto: RequestStatusDto) {
    try {

      const schedules = await this.getSchedulesByStatus({limit, offset}, 'invitee.id = :userId ', ScheduleStatusDto, user);
      if(schedules.length === 0) return {schedules: []};

      const participantsIds = schedules.map((schedule) => schedule.participants.map((participant) => participant.id)).flat();
      const requesterInfo = await this.getUserInformation(schedules[0].requester.id);
      const participantsInfo = await this.getParticipantsInformation(participantsIds);

      delete schedules[0].invitee;
      return {
        schedules: schedules.map((schedule) => {
          return {
            ...schedule,
            requester: requesterInfo,
            participants: participantsInfo,
          };
        })
      }
    } catch (error) {
      handleDBError(error);
    }
  }

  async findOneSchedule(id: string) {

      const schedule = await this.scheduleRepository.createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.requester', 'requester')
      .leftJoinAndSelect('schedule.invitee', 'invitee')
      .leftJoinAndSelect('schedule.participants', 'participants')
      .select([
        'schedule.id',
        'schedule.topic',
        'schedule.location',
        'schedule.date',
        'schedule.time',
        'schedule.status',
        'requester.id',
        'invitee.id',
        'participants.id',
      ])
      .where('schedule.id = :id', {id})
      .getOne();
      if(!schedule) throw new BadRequestException('Schedule not found');
      return schedule;

  }
  async findOne(id: string) {
    
    const schedule = await this.findOneSchedule(id);

    if(!schedule) throw new BadRequestException('Schedule not found');

    try {
      const participantsIds = schedule.participants.map((participant) => participant.id);
      const requesterInfo = await this.getUserInformation(schedule.requester.id);
      const inviteeInfo = await this.getUserInformation(schedule.invitee.id);
      const participantsInfo = await this.getParticipantsInformation(participantsIds);

      return {
        ...schedule,
        requester: requesterInfo,
        invitee: inviteeInfo,
        participants: participantsInfo,
      };
    } catch (error) {
      handleDBError(error);
    }
  }

  async acceptSchedule(id: string, ScheduleStatusDto: RequestStatusDto, user: User) {
    const schedule = await this.findOneSchedule(id);
    if(schedule.invitee.id !== user.id) throw new BadRequestException('You are not the invitee of this schedule');
    try {
      schedule.status = ScheduleStatusDto.status;
      await this.scheduleRepository.save(schedule);
      return { message: 'Schedule accepted successfully' };
      
    } catch (error) {
      handleDBError(error);
    }
  }

  async rejectSchedule(id: string,  user: User) {
    const schedule = await this.findOneSchedule(id);
    if(schedule.invitee.id !== user.id) throw new BadRequestException('You are not the invitee of this schedule');
    try {
      await this.scheduleRepository.delete(id);
      return { message: 'Schedule rejected successfully' };
    } catch (error) {
      handleDBError(error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_3PM, {
    name: 'delete_past_schedules',
    timeZone: 'America/Mexico_City',
  }) // Execute every day at 3pm on Mexico City timezone
  async deletePastSchedules(): Promise<void> {
    const currentDateTime = new Date();
    console.log('Deleting past schedules');
    await this.scheduleRepository.createQueryBuilder()
      .delete()
      .from(Schedule)
      .where('date < :currentDate OR (date = :currentDate AND time < :currentTime)', {
        currentDate: currentDateTime.toISOString().split('T')[0],
        currentTime: currentDateTime.toTimeString().split(' ')[0],
      })
      .execute();
  }
}
