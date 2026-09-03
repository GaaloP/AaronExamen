
import {
    Column,
    CreateDateColumn,
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
    id!: string;

    @CreateDateColumn()
    date!: Date;

    @ManyToOne(() => User, { eager: false, nullable: false })
    @JoinColumn({ name: 'modifierUserUUID' })
    modifierUser!: User;

    @Column({ type: 'uuid' })
    ticketUuid!: string;

    @Column({ type: 'enum', enum: TicketStatus, nullable: true })
    lastState?: TicketStatus;

    @Column({ type: 'enum', enum: TicketStatus, })
    actualState!: TicketStatus;

    @Column({ type: 'varchar', length: 255, nullable: true })
    comment?: string;
}