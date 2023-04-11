import { BaseDto } from "modules/base/base.dto"
import { IsString } from "class-validator"

export class ChangePassDto extends BaseDto {
    @IsString()
    readonly lastPassword!: string
    @IsString()
    readonly newPassword!: string
}