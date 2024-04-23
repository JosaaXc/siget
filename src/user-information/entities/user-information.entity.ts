import { User } from "src/auth/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserInformation {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    name: string;

    @Column('text')
    fatherLastName: string; 

    @Column('text')
    motherLastName: string;

    @Column('text',{
        unique: true,
    })
    phoneNumber: string;

    @Column('text')
    address: string;

    @OneToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn()
    user: User;

}
