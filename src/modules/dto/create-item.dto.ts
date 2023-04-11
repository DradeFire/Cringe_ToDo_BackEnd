import { IsString } from 'class-validator';
import { BaseDto } from 'modules/base/base.dto';


export class CreateItemDto extends BaseDto {
  @IsString()
  readonly title!: string;
}
