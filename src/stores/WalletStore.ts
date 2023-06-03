import { computed, makeObservable, observable, runInAction } from 'mobx'
import {
  connect,
  watchAccount,
  watchNetwork,
  GetNetworkResult,
  GetAccountResult,
} from '@wagmi/core'
import {metamaskConnector} from '../wagmi/wagmiConfig'
import {config} from '../config'

export class WalletStore {
  _account: GetAccountResult = {
    address: undefined,
    connector: undefined,
    isConnected: false,
    isReconnecting: false,
    isConnecting: false,
    isDisconnected: true,
    status: 'disconnected',
  }

  _network: GetNetworkResult = {
    chain: undefined,
    chains: [],
  }

  provider: unknown;

  constructor() {

    makeObservable(
      this,
      {
        _network: observable,
        _account: observable,
        isConnected: computed,
        walletAddress: computed,
        provider: observable,
      },
      { autoBind: true }
    )

    watchAccount((account) => {
      runInAction(() => {
        this._account = account
      })
    })

    watchNetwork((network) => {
      runInAction(() => {
        this._network = network
      })
    })


    // wagmiConfig.autoConnect().then((result) => {
    //   console.log('### wagmi autoConnect')
    //
    //   // web3 should works with harmony network
    //   if (result && result.chain && result.chain.id === config.chainParameters.id) {
    //     const { account } = result;
    //   } else {
    //     console.log('### wallet connect to wrong network')
    //   }
    // })

  }

  get isConnecting() {
    return this._account.isConnecting
  }

  get isConnected() {
    return this._account.isConnected && this.isHarmonyNetwork
  }

  get walletAddress() {
    return this._account.address
  }

  get isHarmonyNetwork() {
    return (
      this._network.chain &&
      this._network.chain.id === config.chainParameters.id
    )
  }

  get isMetamaskAvailable() {
    return metamaskConnector && metamaskConnector.ready
  }

  setProvider(provider: unknown) {
    // const web3Provider = new ethers.providers.Web3Provider(provider)

    this.provider = provider;
  }

  connect() {
    return connect({
      chainId: config.chainParameters.id,
      connector: metamaskConnector,
    }).then(async (result) => {

      const {account} = result;
      result.connector?.getWalletClient()
      const provider = await result.connector?.getProvider()
      this.setProvider(provider, account)
    })
  }
}

export const walletStore = new WalletStore()
