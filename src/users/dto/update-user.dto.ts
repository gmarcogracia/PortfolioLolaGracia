import { MinLength } from "class-validator";

export class UpdateUserDto{
    @MinLength(4)
    username:string;
    @MinLength(4)
    password:string;
  
}