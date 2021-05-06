export interface IApiItem {
  fileurl: string;
  id: number;
  contractaddress: string;
  itemname: string;
  likecount: number;
  metadata: string;
}

export interface IItem extends IApiItem {
  poolId?: number;
}

export function mapItem(item: IApiItem): IItem {
  return item;
}