import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { GraduationOptionType } from '../interfaces/graduation-options.interfaces';

@Entity({ name: "graduation_options" })
export class GraduationOption {

    @PrimaryGeneratedColumn('uuid')
    id: string; 

    @Column({
        type: 'enum', 
        enum: GraduationOptionType, 
        unique: true, 
        nullable: false
    })
    name: string;

}
