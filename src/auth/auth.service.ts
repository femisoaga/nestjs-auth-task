import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private UserModel: Model<User>,
        private jwtService: JwtService
    ) { }

    async signup(signUpData: SignUpDto) {
        const { email, password, username } = signUpData;

        const [emailInUse, usernameInUse] = await Promise.all([
            this.UserModel.findOne({ email }),
            this.UserModel.findOne({ username })
        ]);

        if (emailInUse) {
            throw new BadRequestException('Email already in use');
        }

        if (usernameInUse) {
            throw new BadRequestException('Username already in use');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await this.UserModel.create({
            username,
            email,
            password: hashedPassword
        })

        return { message: 'Signup successful' };

    }

    async login({ email, password }: AuthPayloadDto) {
        const user = await this.UserModel.findOne({ email });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const userObj = user.toObject() as User & { _id: any };
        const { password: _, ...userPayload } = userObj;

        return {
            access_token: this.jwtService.sign({
                sub: userObj._id.toString(),
                email: userObj.email,
                username: userObj.username
            }, { expiresIn: '1h' }),
        };
    }
}
