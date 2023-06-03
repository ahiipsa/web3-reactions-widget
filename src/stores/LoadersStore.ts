import { action, makeObservable, observable } from 'mobx'

export enum LoaderStatus {
  IDLE = 'IDLE',
  PROGRESS = 'PROGRESS',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface LoaderItem {
  type?: LoaderStatus
  render: React.ReactNode
}

const idleLoader = { type: LoaderStatus.IDLE, render: '' }

export class LoadersStore {
  _map: { [key: string]: LoaderItem }

  constructor() {
    makeObservable(
      this,
      {
        _map: observable.deep,
        setLoader: action,
      },
      { autoBind: true }
    )
    this._map = {}
  }

  setLoader(loaderId: string, loader: LoaderItem) {
    this._map[loaderId] = loader
  }

  isProgress(loaderId: string) {
    return (
      this._map[loaderId] &&
      this._map[loaderId].type === LoaderStatus.PROGRESS
    )
  }

  getLoader(loaderId: string): LoaderItem {
    return this._map[loaderId] || idleLoader
  }
}

export const loadersStore = new LoadersStore();