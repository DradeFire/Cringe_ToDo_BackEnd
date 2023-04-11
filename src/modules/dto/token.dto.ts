import { IsString } from "class-validator"
import { BaseDto } from "modules/base/base.dto"

export class TokenDto extends BaseDto {
    @IsString()
    readonly login!: string
    @IsString()
    readonly token!: string
}