import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AcceptedTopic } from "../../accepted-topics/entities/accepted-topic.entity";
import { User } from "../../auth/entities/user.entity";

@Entity({ name: 'topic_reviewers' })
export class TopicReviewer {

    @PrimaryGeneratedColumn('uuid')
    id: string; 

    @ManyToOne(() => AcceptedTopic, acceptedTopic => acceptedTopic.id, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'topicId' })
    topicId: AcceptedTopic;

    @ManyToOne(() => User, user => user.id, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'reviewerId' })
    reviewerId: User;

}
