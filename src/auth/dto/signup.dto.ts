import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class SignUpDto {
      @IsString()
    @MinLength(3)
    @MaxLength(20)
    username: string;
    
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number.'
    })  
    password: string;
}