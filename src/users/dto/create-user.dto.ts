import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
    Length,
    MinLength
} from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @Length(2, 30)
    username: string

    @IsOptional()
    @IsString()
    @Length(0, 200)
    about: string

    @IsUrl()
    avatar: string

    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string
}
