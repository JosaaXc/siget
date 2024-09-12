import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from "typeorm";
import { DegreeProgram } from "../../degree-programs/entities/degree-program.entity";
import { User } from "../../auth/entities/user.entity";
import { ProposedByRole } from "../../common/interfaces/proposed-by-role.interface";
import { GraduationOption } from "../../graduation-options/entities/graduation-option.entity";

@Entity({ name: 'finished_topics' })
@Unique(['requestedBy', 'acceptedBy'])
export class FinishedTopic {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @ManyToOne(() => DegreeProgram, { eager: true, onDelete: 'CASCADE' })
    degreeProgram: DegreeProgram;

    @ManyToOne(() => GraduationOption, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'graduationOption' })
    graduationOption: GraduationOption;

    @ManyToOne(() => User, { eager: true , onDelete: 'CASCADE' })
    @JoinColumn({ name: 'requestedBy' })
    requestedBy: User;

    @ManyToOne(() => User, { eager: true, onDelete: 'SET NULL'})
    @JoinColumn({ name: 'collaborator' })
    collaborator: User;

    @Column({
        type: 'enum',
        enum: ProposedByRole,
        nullable: false
    })
    proposedByRole: string; 

    @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE'})
    @JoinColumn({ name: 'acceptedBy' })
    acceptedBy: User;
    
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    finishedAt: Date;
    
}