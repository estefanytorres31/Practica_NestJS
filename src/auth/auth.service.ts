import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async register(dto: RegisterDto) {
        const existing = await this.usersService.findByEmail(dto.email);
        if (existing) {
        throw new ConflictException('El correo ya está en uso');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = await this.usersService.create({
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        });

        return this.getAccessToken(user);
    }

    async login(dto: LoginDto) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user) throw new UnauthorizedException('Credenciales inválidas');

        const isMatch = await bcrypt.compare(dto.password, user.password);
        if (!isMatch) throw new UnauthorizedException('Credenciales inválidas');

        return this.getAccessToken(user);
    }

    async getAccessToken(user: any) {
        const payload = {
        sub: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        };

        return {
        access_token: this.jwtService.sign(payload),
        user: payload,
        };
    }
}
