import { IsNumber, Max } from "class-validator";

export class AsignRoleDto{
    @Max(4)
    @IsNumber()
    role:number
}