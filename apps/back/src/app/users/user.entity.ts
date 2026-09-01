import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    uuid?: string;

    @Column()
    fullName?: string;

    @Column({ unique: true })
    email?: string;

    @Column()
    password?: string;

    @Column({ default: 'user' })
    role?: string;
}