import { IsBoolean, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class ProjectAuthDto {
  @IsString()
  public projectSecretKey: string;
}

export class NewSignDto {
  @IsNumber()
  public type: number;

  @IsOptional()
  @IsBoolean()
  public isMultiple: boolean;

  @IsString()
  public signer: string;

  @IsString()
  public message: string;

  @IsString()
  public info: string;

  @IsOptional()
  @IsObject()
  public argument: object;
}
