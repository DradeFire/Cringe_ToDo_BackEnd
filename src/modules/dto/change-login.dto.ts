import { BaseDto } from "modules/base/base.dto"
import { IsString } from "class-validator"

export class ChangeLoginDto extends BaseDto {
    @IsString()
    readonly lastLogin!: string
    @IsString()
    readonly newLogin!: string
}