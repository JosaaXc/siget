import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Topic } from "../../topic/entities/topic.entity";
import { User } from "../../auth/entities/user.entity";

@Entity()
export class TopicRequest {

    @PrimaryGeneratedColumn('uuid')
    id: string; 

    @ManyToOne(() => Topic, { eager:true, onDelete: 'CASCADE'})
    @JoinColumn({name: 'topic'})
    topic: Topic; 

    @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE'})
    @JoinColumn({name: 'requestedBy'})
    requestedBy: User;

    @Column('bool', {
        default: false
    })
    isAccepted: boolean; 

}
