// Base dtop if needed, inherit your dto from this one

import { IsOptional, IsString } from 'class-validator';

export abstract class BaseDto {
  @IsString()
  @IsOptional()
  value?: string;
}
