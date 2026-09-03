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
    OPEN = 'Abierto',
    IN_PROGRESS = 'En progreso',
    CLOSED = 'Cerrado',
}

export enum TicketCategory {
    TECH_SUPPORT = 'Soporte técnico',
    BILLING = 'Facturación',
    ACCOUNT = 'Cuenta',
    OTHER = 'Otro'
}

@Entity('tickets')
export class Ticket {
    @PrimaryGeneratedColumn('uuid')
    uuid!: string;

    @Column({ type: 'int', generated: 'increment', unique: true })
    ticketCode!: number;

    @Column({ type: 'enum', enum: TicketCategory })
    category!: TicketCategory;

    @Column({ type: 'varchar', length: 500 })
    description!: string;
    
    @ManyToOne(() => User)
    @JoinColumn({ name: 'assignedToUuid' })
    assignedTo!: User;

    @CreateDateColumn()
    createdAt!: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'createdByUuid' })
    createdBy!: User;

    @Column({ type: 'enum', enum: TicketStatus, default: TicketStatus.OPEN })
    status!: TicketStatus;
    
    @Column({ type: 'timestamp', nullable: true })
    closedAt?: Date | null;
}