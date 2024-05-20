import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { AcceptedTopic } from '../../accepted-topics/entities/accepted-topic.entity';
import { User } from "../../auth/entities/user.entity";

@Entity({ name: 'topic_documents' })
export class TopicDocument{

  @PrimaryGeneratedColumn('uuid')
  id: string; 

  @OneToOne(() => AcceptedTopic, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'acceptedTopic'})
  acceptedTopic: AcceptedTopic

  @Column('text', { nullable: false })
  url: string; 

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'uploadedBy'})
  uploadedBy: User;

}