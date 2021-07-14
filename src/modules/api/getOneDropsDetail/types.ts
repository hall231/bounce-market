export interface IGetOneDropsDetailParams {
  dropsid: number;
  limit: number;
  offset: number;
  poolstate: number;
}

export enum DropsDetailPoolState {
  Live,
  Closed,
}

export interface IApiDropsDetailPoolInfo {
  fileurl: string;
  name: string;
  poolid: number;
  pooltype: number;
  price: string;
  state: DropsDetailPoolState;
  swapped_amount0: number;
  token_amount0: number;
}

export interface IApiOneDropsDetailData {
  accountaddress: string;
  avatar: string;
  bgcolor: string;
  coverimgurl: string;
  creator: string;
  description: string;
  dropdate: number;
  instagram: string;
  poolsinfo: IApiDropsDetailPoolInfo[];
  title: string;
  twitter: string;
  website: string;
}

export interface IApiOneDropsDetail {
  code: number;
  data?: IApiOneDropsDetailData;
  msg?: string;
}