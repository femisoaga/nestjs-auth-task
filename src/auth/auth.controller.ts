import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LocalGuard } from 'src/auth/guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { SignUpDto } from './dto/signup.dto';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signup')
    @Throttle({ default: { limit: 3, ttl: 15 * 60 * 1000 } }) 
    @HttpCode(HttpStatus.CREATED)
    async signup(@Body() signUpData: SignUpDto) {
        return this.authService.signup(signUpData);
    }

    @Post('login')
    @UseGuards(LocalGuard)
    @Throttle({ default: { limit: 5, ttl: 15 * 60 * 1000 } })
    @HttpCode(HttpStatus.OK)
    login(@Req() req: Request) {
        return req.user;
    }

    @Get('status')
    @UseGuards(JwtAuthGuard)
    @SkipThrottle()
    status(@Req() req: any) {
        console.log('Status endpoint accessed inside AuthController status method');
        console.log('User:', req.user);
        return req.user
    }
}
