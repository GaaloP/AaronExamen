import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
    SUPERVISOR = 'Supervisor',
    AGENT = 'Agente',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    uuid!: string;

    @Column({ type: 'varchar' })
    fullName!: string;

    @Column({ unique: true, type: 'varchar' })
    email!: string;

    @Column({ type: 'varchar' })
    password!: string;

    @Column({ type: 'enum', enum: UserRole })
    role!: UserRole;
}