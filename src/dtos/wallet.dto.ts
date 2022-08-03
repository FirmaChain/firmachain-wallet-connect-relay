import { IsOptional, IsString } from 'class-validator';

export class WalletAuthDto {
  @IsString()
  @IsOptional()
  public userkey: string;
}

export class RequestDto {
  @IsString()
  public requestKey: string;
}

export class VerifyDto {
  @IsString()
  public signature: string;
}

export class ApproveDto {
  @IsString()
  public rawData: string;

  @IsString()
  public address: string;

  @IsString()
  public chainId: string;
}
