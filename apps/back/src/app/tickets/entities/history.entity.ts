
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/user.entity';
import { TicketStatus } from './ticket.entity';

@Entity()
export class History {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column({ type: 'timestamp' })
    date?: Date;

    @ManyToOne(() => User, { eager: false, nullable: false })
    @JoinColumn({ name: 'modifierUserUUID' })
    modifierUser?: User;

    @Column({ type: 'uuid' })
    ticketUuid?: string;

    @Column({ type: 'enum', enum: TicketStatus, nullable: true })
    lasState?: TicketStatus;

    @Column({ type: 'enum', enum: TicketStatus, nullable: true })
    actualState?: TicketStatus;

    @Column({ type: 'varchar', length: 255, nullable: true })
    comment?: string;
}