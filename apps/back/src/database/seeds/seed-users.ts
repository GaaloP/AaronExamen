import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../../app/users/user.entity';
import 'dotenv/config';

const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User],
    synchronize: false,
});

async function seedUsers() {
    await dataSource.initialize();
    const userRepository = dataSource.getRepository(User);
    const users = [

        { fullName: 'Carlitos Su Papa', email: 'admin@test.com', password: 'admin123'},
        { fullName: 'Valer IA', email: 'user1@test.com', password: 'user123' },
        { fullName: 'Chris Chan', email: 'user2@test.com', password: 'user123', role: UserRole.SUPERVISOR },
        { fullName: 'Gael Posaderas', email: 'user3@test.com', password: 'user123', role: UserRole.SUPERVISOR },
    ];

    for (const user of users) {
        const existingUser = await userRepository.findOne({ where: { email: user.email } });

        if (existingUser) {
            console.log(`User with email ${user.email} already exists.`);
            continue;
        }

        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newUser = userRepository.create({
            ...user,
            password: hashedPassword,
            role: UserRole.AGENT,
        });

        await userRepository.save(newUser);
        console.log(`Usuario creado: ${user.email}`);
    }

    await dataSource.destroy();
    console.log('Seed finalizado.');
}

seedUsers().catch((err) => {
    console.error('Error ejecutando el seed:', err);
    process.exit(1);
});