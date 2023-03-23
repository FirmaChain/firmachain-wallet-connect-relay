export interface IProject {
  name: string;
  description: string;
  url: string;
  icon: string;
  identity: string;
  isCertified: boolean;
  isServiceOnly: boolean;
  serviceList: IService[];
  token: IToken;
  order: number;
}

export interface IService {
  serviceId: string;
  name: string;
  url: string;
  icon: string;
  isExternalBrowser: boolean;
}

export interface IToken {
  symbol: string;
  denom: string;
  decimal: number;
}
