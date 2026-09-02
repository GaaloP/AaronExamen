import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/user.entity';

export enum TicketStatus {
    OPEN = 'open',
    IN_PROGRESS = 'in_progress',
    CLOSED = 'closed',
}

@Entity()
export class Ticket {
    @PrimaryGeneratedColumn('uuid')
    uuid?: string;

    @Column({ type: 'int', generated: 'increment', unique: true })
    ticketCode?: number;

    @Column()
    category?: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    description?: string | null;

    @Column({ type: 'enum', enum: TicketStatus, default: TicketStatus.OPEN })
    status?: TicketStatus;

    @ManyToOne(() => User, { eager: false, nullable: false })
    @JoinColumn({ name: 'assignedToUuid' })
    assignedTo?: User;

    @CreateDateColumn({ type: 'timestamp' })
    openAt?: Date;

    @Column({ type: 'timestamp', nullable: true })
    closedAt?: Date | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    comments?: string | null;
}