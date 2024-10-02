import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { DegreeProgram } from '../../degree-programs/entities/degree-program.entity';
import { GraduationOption } from '../../graduation-options/entities/graduation-option.entity';

@Entity({ name: 'abandoned_topics' })
export class AbandonedTopic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  title: string;

  @Column('text')
  description: string;

  @ManyToOne(() => DegreeProgram, { eager: true })
  degreeProgram: DegreeProgram;

  @ManyToOne(() => GraduationOption, { eager: true })
  graduationOption: GraduationOption;

  @ManyToOne(() => User, { eager: true })
  acceptedBy: User;
  
}