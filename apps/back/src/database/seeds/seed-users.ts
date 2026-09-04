import { Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
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

export async function seedUsers(
    userRepository: Repository<User>,
    logger: Pick<Logger, 'log'>,
) {
    const users = [

        { fullName: 'Carlitos Su Papa', email: 'admin@test.com', password: 'admin123', role: UserRole.SUPERVISOR },
        { fullName: 'Valer IA', email: 'user1@test.com', password: 'user123', role: UserRole.AGENT},
        { fullName: 'Chris Chan', email: 'user2@test.com', password: 'user123', role: UserRole.AGENT },
        { fullName: 'Gael Posaderas', email: 'user3@test.com', password: 'user123', role: UserRole.AGENT },
        { fullName: 'Tlatoani Aaron', email: 'admin2@test.com', password: 'admin123', role: UserRole.SUPERVISOR },
    ];

    for (const user of users) {
        const existingUser = await userRepository.findOne({ where: { email: user.email } });

        if (existingUser) {
            logger.log(`Useuario con email ${user.email} ya existe, se omite.`);
            continue;
        }

        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newUser = userRepository.create({
            ...user,
            password: hashedPassword,
        });

        await userRepository.save(newUser);
        logger.log(`Usuario creado: ${user.email}`);
    }

    logger.log('Seed de usuarios finalizado.');
}

async function runStandaloneSeed() {
    await dataSource.initialize();
    try {
        await seedUsers(dataSource.getRepository(User), new Logger('UsersSeed'));
    } finally {
        await dataSource.destroy();
    }
}

runStandaloneSeed().catch((error) => {
    new Logger('UsersSeed').error('Error ejecutando el seed.', error);
    process.exitCode = 1;
});