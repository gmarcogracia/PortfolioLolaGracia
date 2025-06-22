import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto{
 
    @MinLength(4)
    @IsString()
    @IsNotEmpty()
    username:string;

    @MinLength(4)
    @IsString()
    @IsNotEmpty()
    password:string
}