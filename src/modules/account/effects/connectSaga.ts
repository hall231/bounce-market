import { getQuery, resetRequests } from '@redux-requests/core';
import { fetchProfileInfo } from 'modules/profile/actions/fetchProfileInfo';
import { END, eventChannel } from 'redux-saga';
import { put, putResolve, select, take, takeEvery } from 'redux-saga/effects';
import { RootState } from 'store';
import { Address } from '../../common/types/unit';
import { connect } from '../store/actions/connect';
import { setAccount } from '../store/actions/setAccount';
import { disconnect } from '../store/actions/disconnect';
import { updateAccount } from '../store/actions/updateAccount';

// TODO: Check disconnection, switch chain, switch account

enum WalletEventType {
  'AccountChanged' = 'AccountChanged',
  'Disconnect' = 'Disconnect',
  'Message' = 'Message',
  'ChainChanged' = 'ChainChanged',
}

export interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}

export interface IAccountChangedEvent {
  type: WalletEventType.AccountChanged;
  data: {
    accounts: Address[];
  };
}

export interface IDisconnectEvent {
  type: WalletEventType.Disconnect;
  error: ProviderRpcError;
}

export interface IMessageEvent {
  type: WalletEventType.Message;
  data: any;
}

export interface IChainChangedEvent {
  type: WalletEventType.ChainChanged;
  data: { chainId: string };
}

export type ProviderEvent =
  | IAccountChangedEvent
  | IDisconnectEvent
  | IMessageEvent
  | IChainChangedEvent;

function createEventChannel(provider: any) {
  return eventChannel(emitter => {
    provider
      .on('accountsChanged', (accounts: Address[]) => {
        emitter({
          data: { accounts },
          type: WalletEventType.AccountChanged,
        } as IAccountChangedEvent);
      })
      .on('disconnect', (error: Error) => {
        emitter({
          error,
          type: WalletEventType.Disconnect,
        } as IDisconnectEvent);
        emitter(END);
      })
      .on('message', (message: any) => {
        emitter({ message, type: WalletEventType.Message });
      })
      .on('chainChanged', (chainId: string) => {
        emitter({
          data: { chainId },
          type: WalletEventType.ChainChanged,
        } as IChainChangedEvent);
      });

    return () => {
      if (provider.disconnect instanceof Function) {
        provider.disconnect();
      }
    };
  });
}

function* onConnectWallet() {
  const { action, error } = yield putResolve(setAccount());
  if (error || action.type === 'AccountActions/setAccount_ERROR') {
    return;
  }
  const provider = action.meta.provider;
  yield put(fetchProfileInfo());

  const channel = createEventChannel(provider);
  while (true) {
    const event: ProviderEvent = yield take(channel);

    if (event.type === WalletEventType.ChainChanged) {
      if (event.data.chainId) {
        yield put(updateAccount({ chainId: event.data.chainId }));
      }
    } else if (event.type === WalletEventType.AccountChanged) {
      const address =
        event.data.accounts.length > 0 ? event.data.accounts[0] : undefined;

      const { currentAddress } = yield select((state: RootState) => {
        const {
          data: { address },
        } = getQuery(state, {
          type: setAccount.toString(),
          action: setAccount,
        });

        return { currentAddress: address };
      });

      if (currentAddress.toLowerCase() !== address?.toLowerCase()) {
        yield put(connect());
      }
    }
  }
}

function* onDisconnectWallet() {
  yield put(
    resetRequests([setAccount.toString(), fetchProfileInfo.toString()]),
  );
}

export function* connectSaga() {
  yield takeEvery(connect.toString(), onConnectWallet);
  yield takeEvery(disconnect.toString(), onDisconnectWallet);
}
