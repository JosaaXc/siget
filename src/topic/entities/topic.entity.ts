import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

import { GraduationOption } from '../../graduation-options/entities/graduation-option.entity';
import { User } from "../../auth/entities/user.entity";
import { DegreeProgram } from "../../degree-programs/entities/degree-program.entity";

@Entity({ name: 'topics' })
export class Topic {

    @PrimaryGeneratedColumn('uuid')
    id: string; 

    @Column('text', {
        nullable: false
    })
    title: string;

    @Column('text', {
        nullable: false
    })
    description: string;
    
    @ManyToOne(() => DegreeProgram, { eager: true, onDelete: 'CASCADE' })
    degreeProgram: DegreeProgram;

    @ManyToOne(() => GraduationOption, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'graduationOption' })
    graduationOption: GraduationOption;

    @ManyToOne(() => User, { eager: true , onDelete: 'CASCADE' })
    @JoinColumn({ name: 'proposedBy' })
    proposedBy: User;
    
    @OneToOne(() => User, { eager: true, onDelete: 'SET NULL'})
    @JoinColumn({ name: 'collaborator' })
    collaborator: User;
    
}
