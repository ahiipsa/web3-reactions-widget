import React, {useEffect, useState} from 'react';
import {Widget, widgetClient} from '../clients/widgetClient';
import {ReactionItem} from "./ReactionItem";

const reactions = [
  {
    emojiId: 0,
    emoji: "👍",
    counter: 0,
    active: 1,
  },
  {
    emojiId: 1,
    emoji: "❤️",
    counter: 0,
    active: 0,
  },
  {
    emojiId: 2,
    emoji: "😄️",
    counter: 0,
    active: 0,
  },
  {
    emojiId: 3,
    emoji: "😱️",
    counter: 0,
    active: 0,
  },
  {
    emojiId: 4,
    emoji: "😔️",
    counter: 0,
    active: 0,
  },
];


interface Props {
  widgetId: string
}

export const ReactionWidget: React.FC<Props> = ({widgetId}) => {

  const [widget, setWidget] = useState<Widget | undefined>();

  useEffect(() => {
    loadWidget()
  }, [])

  const loadWidget = () => {
    widgetClient.loadWidget(widgetId).then((response) => {
      setWidget(response)
    })
  }

  const handleClick = (emojiId: number) => {
    console.log('### emojiId', emojiId);
    widgetClient.createReaction(widgetId, {emojiId}).then(() => {
      loadWidget()
    })
  }

  if (!widget) {
    return null;
  }

  const counterMap = widget.reactions.reduce((acc, item) => {
    return {...acc, [item.emojiId]: item.counter}
  }, {} as {[key: number]: number});

  const reactionList = widget.type === 'inline-react-single' ? reactions.slice(0, 1) : reactions;

  console.log('### widget', widget);

  return <>
    {reactionList.map((reaction) => {
      return <ReactionItem
        onClick={handleClick}
        reaction={reaction}
        active={!!(widget?.reaction && widget.reaction.emojiId === reaction.emojiId)}
        counter={counterMap[reaction.emojiId] || 0} />
    })}
  </>;
};

