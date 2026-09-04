import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { User } from '../users/user.entity';
import { AgentsController } from './agents.controller';
import { AgentsService } from './agents.service';

@Module({
    imports: [TypeOrmModule.forFeature([User]), AuthModule],
    controllers: [AgentsController],
    providers: [AgentsService],
})
export class AgentsModule { }