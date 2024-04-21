import { IsEmail } from "class-validator";
import { DegreeProgram } from "src/degree-programs/entities/degree-program.entity";
import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, OneToMany, ManyToMany, JoinTable } from 'typeorm';

@Entity('users')
export class User {
    
    @PrimaryGeneratedColumn('uuid')
    id: string; 

    @IsEmail()
    @Column('text', {
        unique: true
    })
    email: string;

    @Column('text', {
        select: false
    })
    password: string;

    @Column('text')
    fullName: string;

    @Column('text', {
        array: true,
        default: ['STUDENT_ROLE']
    })
    roles: string[];

    @ManyToMany(
        () => DegreeProgram, 
        degreeProgram => degreeProgram.users,
    )
    degreePrograms: DegreeProgram[];

    @BeforeInsert()
    checkFieldBeforeInsert(){
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldBeforeUpdate(){
        this.checkFieldBeforeInsert();
    }
}
