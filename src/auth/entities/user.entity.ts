import { IsEmail } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';

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
        default: ['USER_ROLE']
    })
    roles: string[];

    // In case you need to add a relationship with another entity
    // Don't forget to import the entity and add the relationship on the other entity

    // @OneToMany(
    //     () => Subject,
    //     subject => subject.user,
    //     {
    //         cascade: true
    //     }
    // )
    // subject: Subject[];

    @BeforeInsert()
    checkFieldBeforeInsert(){
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldBeforeUpdate(){
        this.checkFieldBeforeInsert();
    }
}
