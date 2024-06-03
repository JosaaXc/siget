import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { AcceptedTopic } from '../../accepted-topics/entities/accepted-topic.entity';
import { User } from "../../auth/entities/user.entity";
import { TopicDocumentComment } from "../../topic-document-comments/entities/topic-document-comment.entity";

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

  @Column('bool', { default: false })
  chapter1: boolean;
  
  @Column('bool', { default: false })
  chapter2: boolean;
  
  @Column('bool', { default: false })
  chapter3: boolean;
  
  @Column('bool', { default: false })
  chapter4: boolean;
  
  @Column('bool', { default: false })
  chapter5: boolean;
  
  @Column('bool', { default: false })
  chapter6: boolean;
  
  @Column('bool', { default: false })
  chapter7: boolean;

}