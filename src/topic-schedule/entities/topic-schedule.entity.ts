import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from "typeorm";

import { Topic } from "../../topic/entities/topic.entity";
import { User } from "../../auth/entities/user.entity";

@Entity()
@Unique(['topic', 'startTime'])
export class TopicSchedule {

    @PrimaryGeneratedColumn('uuid')
    id: string; 

    @ManyToOne(() => Topic, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'topic' })
    topic: Topic;

    @Column('timestamp')
    startTime: Date;

    @Column('text')
    place: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'bookedBy' })
    bookedBy: User;

}