import React, {useCallback, useEffect, useState} from 'react';
import styled from "styled-components";
import {Widget, widgetClient} from "../clients/widgetClient";
import {Button} from "../components/Button";
import {config} from "../config";


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

export const WidgetEditor: React.FC<Props> = () => {

  const [widgetList, setWidgetList] = useState<Widget[]>([]);

  const crateWidget = useCallback((type: "inline-react" | "inline-react-single") => {
    widgetClient.createWidget(type).then(() => {
      loadWidgetList()
    })
  }, []);

  const loadWidgetList = () => {
    widgetClient.loadWidgetList().then((list) => {
      setWidgetList(list);
    })
  }

  useEffect(() => {
    loadWidgetList()
  }, [])

  return <Container>
    Create widget:
    <Button onClick={() => crateWidget("inline-react-single")}>single emoji</Button>
    <Button onClick={() => crateWidget("inline-react")}>inline emoji</Button>

    <ListContainer>
      {widgetList.map((item) => {
        const link = `${config.widgetClient.host}/notion/reactions_widget/${item.id}`
        return <WidgetItem key={item.id}>
          <div><b>id:</b> {item.id}</div>
          <div><b>type:</b> {item.type}</div>
          <div><b>embed link:</b> <a href={link}>{link}</a></div>
        </WidgetItem>
      })}
    </ListContainer>
  </Container>;
};

WidgetEditor.displayName = 'WIdgetEditor';
