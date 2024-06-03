import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AcceptedTopic } from '../../accepted-topics/entities/accepted-topic.entity';

@Entity({ name: 'advisory_sessions' })
export class AdvisorySession {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { nullable: false })
  reviewedTopic: string;

  @Column('text', { nullable: true })
  observations: string;

  @Column('date')
  date: Date;

  @Column('boolean', { default: false })
  isSigned: boolean;

  @ManyToOne(() => AcceptedTopic, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'acceptedTopic' })
  acceptedTopic: AcceptedTopic;

}