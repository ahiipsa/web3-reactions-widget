import React from 'react'
import { LoaderContainer } from './ProcessStatus.styles'
import {LoaderItem, LoaderStatus} from "../../stores/LoadersStore";

type Props = {
  loader: LoaderItem
}

export const Loader: React.FC<Props> = ({ loader }) => {
  const { type = LoaderStatus.PROGRESS, render = '' } = loader

  return (
    <LoaderContainer colorType={type}>
      {render}
      {/* <span style={{ color: 'red' }}>{type === statusTypes.ERROR ? 'Error' : ''}</span> */}
      {type === LoaderStatus.PROGRESS && <div className="loader" />}
    </LoaderContainer>
  )
}
