import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {Button} from "../components/Button";
import {config} from "../config";
import {createReactionClient, ReactionClient, Widget, WidgetType} from "../clients/contractClient";
import {walletStore} from "../stores/WalletStore";
import {encodeWidgetId} from "../utils";
import {LoadersStore, loadersStore, LoaderStatus} from "../stores/LoadersStore";
import {Loader} from "../components/ProcessStatus/Loader";
import { observer } from 'mobx-react-lite'


const Container = styled.div`
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px
`

const WidgetItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-radius: 8px;
  border: 1px solid;
  padding: 12px;
`

interface Props {
}



export const WidgetEditor: React.FC<Props> = observer(() => {

  const [client, setClient] = useState<ReactionClient>();

  useEffect(() => {
    walletStore.connect().then(async () => {
      const client = await createReactionClient({provider: walletStore.provider, address: walletStore.walletAddress })
      setClient(client)
      loadWidgetList(client)
    });
  }, []);


  const [widgetList, setWidgetList] = useState<Widget[]>([]);

  const crateWidget = async (type: WidgetType) => {
    if (!client) {
      return;
    }

    console.log('### type', type);

    loadersStore.setLoader('CREATE_WIDGET', {type: LoaderStatus.PROGRESS, render: 'Create widget...'})

    await client.createWidget({widgetType: type})

    loadersStore.setLoader('CREATE_WIDGET', {type: LoaderStatus.IDLE, render: ''})

    loadWidgetList(client)
  }

  const loadWidgetList = async (client: ReactionClient) => {

    loadersStore.setLoader('LOAD_WIDGET_LIST', {type: LoaderStatus.PROGRESS, render: 'Loading widgets...'})

    client?.loadMyWidgetList().then((list) => {
      // @ts-ignore
      setWidgetList(list);
      loadersStore.setLoader('LOAD_WIDGET_LIST', {type: LoaderStatus.IDLE, render: ''})
    })
  }

  useEffect(() => {
    if (client) {
      loadWidgetList(client)
    }
  }, [client])

  const widgetListLoader = loadersStore.getLoader('LOAD_WIDGET_LIST')
  const createLoader = loadersStore.getLoader('CREATE_WIDGET')

  return <Container>
    Create widget:
    <Button onClick={() => crateWidget(WidgetType.INLINE_REACT)}>inline emoji</Button>
    <Button onClick={() => crateWidget(WidgetType.INLINE_REACT_SINGLE)}>single emoji</Button>

    {widgetListLoader.type === LoaderStatus.PROGRESS && <Loader loader={widgetListLoader} />}
    {createLoader.type === LoaderStatus.PROGRESS && <Loader loader={createLoader} />}

    <ListContainer>
      {widgetList.map((item) => {
        const hashId = encodeWidgetId(item.id)
        const link = window.location.origin + `/widget/${hashId}`
        return <WidgetItem key={hashId}>
          <div><b>id:</b> {hashId}</div>
          <div><b>type:</b> {item.widgetType.toString()}</div>
          <div><b>embed link:</b> <a href={link}>{link}</a></div>
        </WidgetItem>
      })}
    </ListContainer>
  </Container>;
});