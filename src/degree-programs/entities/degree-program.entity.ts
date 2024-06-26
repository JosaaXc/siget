import { User } from "src/auth/entities/user.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'degree_programs' })
export class DegreeProgram {

    @PrimaryGeneratedColumn('uuid')
    id: string; 

    @Column('text', {
        nullable: false,
        unique: true
    })
    name: string;

    @ManyToMany(
        () => User, 
        user => user.degreePrograms, 
        { onDelete: 'CASCADE'}
    )
    @JoinTable({ name: 'degree_programs_users' })
    users: User[];

    @BeforeInsert()
    checkNameBeforeInsert(){
        this.name = this.name.replace(/\s/g, '-').trim().toLowerCase();
    }


    @BeforeUpdate()
    checkNameBeforeUpdate(){
        this.name = this.name.replace(/\s/g, '-').trim().toLowerCase();
    }
}
