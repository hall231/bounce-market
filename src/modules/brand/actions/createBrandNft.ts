import { TransactionReceipt } from '@ethersproject/abstract-provider';
import { DispatchRequest, getQuery, RequestAction } from '@redux-requests/core';
import { uploadFile } from 'modules/common/actions/uploadFile';
import { Store } from 'redux';
import { createAction as createSmartAction } from 'redux-smart-actions';
import { RootState } from 'store';
import { setAccount } from '../../account/store/actions/setAccount';
import { AbiItem } from 'web3-utils';
import {
  default as BounceErc721,
} from '../contract/BounceErc721.json';
import {
  default as BounceErc1155,
} from '../contract/BounceErc1155.json';
import { isVideo } from '../../common/utils/isVideo';
import { IBrandInfo } from '../api/queryBrand';
import { addItem, IAddItemPayload } from 'modules/createNFT/actions/addItem';

export enum NFTStandard {
  ERC721 = 1,
  ERC1155 = 2,
}

export enum Channel {
  FineArts = 'Fine Arts',
  Sports = 'Sports',
  Conicbooks = 'Comics',
}

export interface ICreateNFTPayload {
  name: string;
  description: string;
  channel: Channel;
  standard: NFTStandard;
  supply: number;
  file: File;
}
// TODO: Remove timers
export const createBrandNFT = createSmartAction(
  'createBrandItem',
  ({
    file,
    standard,
    supply,
    name,
    description,
    channel,
  }: ICreateNFTPayload,
    brandInfo: IBrandInfo) => ({
      request: {
        promise: (async function () { })(),
      },
      meta: {
        asMutation: true,
        onRequest: (
          request: { promise: Promise<any> },
          action: RequestAction,
          store: Store<RootState> & { dispatchRequest: DispatchRequest },
        ) => {
          return {
            promise: (async function () {
              const { data } = await store.dispatchRequest(uploadFile({ file }));
              
              const {
                data: { address, web3 },
              } = getQuery(store.getState(), {
                type: setAccount.toString(),
                action: setAccount,
              });

              const addItemPayload: IAddItemPayload = {
                brandid: brandInfo.id,
                category: isVideo(file) ? 'video' : 'image',
                channel,
                contractaddress: brandInfo.contractaddress,
                description,
                fileurl: data?.result.path || '',
                itemname: name,
                itemsymbol: brandInfo.brandsymbol,
                owneraddress: brandInfo.owneraddress,
                ownername: brandInfo.ownername,
                standard: brandInfo.standard,
                supply: standard === NFTStandard.ERC721 ? 1 : supply, 
              };

              const { data: addItemData } = await store.dispatchRequest(
                addItem(addItemPayload),
              );

              if (!addItemData) {
                throw new Error("Item hasn't been added");
              }

              if (standard === 1) {
                return await new Promise((resolve, reject) => {
                  const ContractBounceERC72 = new web3.eth.Contract(
                    (BounceErc721.abi as unknown) as AbiItem,
                    brandInfo.contractaddress,
                  );

                  ContractBounceERC72.methods
                    .mint(
                      address,
                      addItemData.id,
                    )
                    .send({ from: address })
                    .on('transactionHash', (hash: string) => {
                      // Pending status
                    })
                    .on('receipt', async (receipt: TransactionReceipt) => {
                      setTimeout(() => {
                        resolve(receipt);
                      }, 15000);
                    })
                    .on('error', (error: Error) => {
                      reject(error);
                    });
                });
              } else if (standard === 2) {
                return await new Promise((resolve, reject) => {
                  const ContractBounceERC1155 = new web3.eth.Contract(
                    (BounceErc1155.abi as unknown) as AbiItem,
                    brandInfo.contractaddress,
                  );
                  ContractBounceERC1155.methods
                    .mint(
                      address,
                      addItemData.id,
                      supply,
                      0,
                    )
                    .send({ from: address })
                    .on('transactionHash', (hash: string) => {
                      // Pending status
                    })
                    .on('receipt', async (receipt: TransactionReceipt) => {
                      setTimeout(() => {
                        resolve(receipt);
                      }, 15000);
                    })
                    .on('error', (error: Error) => {
                      reject(error);
                    });
                });
              }
            })(),
          };
        },
      },
    }),
);