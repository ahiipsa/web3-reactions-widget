import React from 'react';
import styled from "styled-components";
import {ReactionWidget} from "./ReactionWidget";
import {useParams} from "react-router-dom";

const Widget = styled.div`
  display: flex;
  background-color: white;
  padding: 4px;
  font-family: Tahoma;
`

export const WidgetContainer: React.FC = () => {
  const {widgetId} = useParams()

  console.log('### widgetId', widgetId);

  return (
    <Widget>
      {widgetId && <ReactionWidget widgetId={widgetId} />}
    </Widget>
  );
};

