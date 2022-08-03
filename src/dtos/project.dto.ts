import { IsNumber, IsString } from 'class-validator';

export class ProjectAuthDto {
  @IsString()
  public projectSecretKey: string;
}

export class NewSignDto {
  @IsNumber()
  public type: number;

  @IsString()
  public signer: string;

  @IsString()
  public message: string;

  @IsString()
  public info: string;
}
