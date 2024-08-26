import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';
import { USERS_SEED } from './data/seed.data';

@Injectable()
export class SeedService {

    private isProd: boolean;

    constructor(
        private readonly configService: ConfigService,
        private readonly authService: AuthService
    ) {
        this.isProd = this.configService.get('STATE') === 'production';
    }


    async seed() {
        if (this.isProd) 
            throw new UnauthorizedException('You are not allowed to seed in production');

        // Seed users
        await this.seedUsers();

    }
    
    async seedUsers() {
        Promise.all(USERS_SEED.map(async user => {
            await this.authService.create(user);
        }));
    }

}
