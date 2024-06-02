import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable, Unique} from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { ScheduleStatus } from '../interfaces/schedule-status.interface';

@Entity()
@Unique(['date', 'time'])
export class Schedule {

  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column('text', {
    nullable: false,
  })
  topic: string;

  @Column('text', {
    nullable: false,
  })
  location: string;

  @Column('date', {
    nullable: false,
  })
  date: Date;

  @Column('time', {
    nullable: false,
  })
  time: string;

  @Column({
    type: 'enum',
    enum: ScheduleStatus,
    default: ScheduleStatus.PENDING,
  })
  status: ScheduleStatus;

  @ManyToMany(() => User, { onDelete: 'CASCADE' })
  @JoinTable({ name: 'schedule_participants' })
  participants: User[];

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'requester' })
  requester: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invitee' })
  invitee: User; 

}