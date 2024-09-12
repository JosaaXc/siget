import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { TopicDocument } from 'src/files/entities/topic-document.entity';
import { User } from '../../auth/entities/user.entity';

@Entity({ name: 'topic_document_comments' })
export class TopicDocumentComment {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { nullable: false })
  comment: string;

	@Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @ManyToOne(() => TopicDocument, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'topicDocument' })
  topicDocument: TopicDocument;

  @ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'madeBy' })
  madeBy: User; 

}
