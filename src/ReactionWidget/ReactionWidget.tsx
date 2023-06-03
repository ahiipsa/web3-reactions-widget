import React, {useEffect, useState} from 'react';
import {ReactionItem} from "./ReactionItem";
import {
  contractReadOnly,
  createReactionClient,
  Reaction,
  ReactionClient,
  Widget,
  WidgetType
} from "../clients/contractClient";
import {decodeWidgetId} from "../utils";
import {walletStore} from "../stores/WalletStore";
import {loadersStore, LoaderStatus} from "../stores/LoadersStore";
import {Loader} from "../components/ProcessStatus/Loader";
import {useAccount} from "wagmi";

const REACTIONS = [
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

  console.log('### #1', decodeWidgetId('33x3q9R8v0zgww7N2612mmJ1zp5z4L48AMpxOnqv74XoJkYQ').toString());
  console.log('### #2', decodeWidgetId('P8QvY6G39xzEw1EPx7OLJqz5VrA5AZLyK58Z1ArpREX34KAw').toString());

  const [widget, setWidget] = useState<Widget | undefined>();
  const [reactionList, setReactionList] = useState<Reaction[]>([]);
  const _widgetId = decodeWidgetId(widgetId).toString();

  const [client, setClient] = useState<ReactionClient>();


  useEffect(() => {
    loadWidget()
  }, [])

  const loadWidget = async () => {
    loadersStore.setLoader('LOAD_WIDGET', {type: LoaderStatus.PROGRESS, render: 'Update reactions...'})


    const reactionList = await contractReadOnly.getWidgetReactions(_widgetId)

    setReactionList(reactionList)

    console.log('### widget load', _widgetId);
    const widget = await contractReadOnly.getWidget(_widgetId)
    console.log('### widget', widget.id);
    setWidget(widget);

    loadersStore.setLoader('LOAD_WIDGET', {type: LoaderStatus.IDLE, render: ''})
  }

  const {connector} = useAccount()

  const handleClickReaction = async (emojiId: number) => {

    // loadersStore.setLoader('UPDATE_REACTIONS', {type: LoaderStatus.PROGRESS, render: 'Update reactions...'});
    if (!walletStore.isConnected) {
      await walletStore.connect();
    }

    const client = await createReactionClient({provider: walletStore.provider, address: walletStore.walletAddress })
    setClient(client)

    const reactionList = await contractReadOnly.getWidgetReactions(_widgetId)
    const reaction = reactionList.find((item: Reaction) => item.ownerAddress === walletStore.walletAddress);

    if (!reaction) {
      console.log('### create');
      await client.createReaction({widgetId: _widgetId, emojiId});
    }

    console.log('### reaction', reaction);

    if (reaction && reaction.emojiId.toString() === emojiId.toString()) {
      console.log('### remove');
      await client.removeReaction({widgetId: _widgetId})
    }

    if (reaction && reaction.emojiId.toString() !== emojiId.toString()) {
      console.log('### change');
      await client.changeReaction({widgetId: _widgetId, emojiId})
    }

    loadWidget()
    // loadersStore.setLoader('UPDATE_REACTIONS', {type: LoaderStatus.IDLE, render: ''})
  }

  if (!widget) {
    return null;
  }


  const counterMap = reactionList.reduce((acc, item) => {

    console.log('### item.ownerAddress', item.ownerAddress);
    if (item.ownerAddress === '0xx') {

      return acc;
    }
    if (!acc[item.emojiId]) {
      return {...acc, [item.emojiId]: 1}
    }

    return {...acc, [item.emojiId]: acc[item.emojiId] + 1 }
  }, {} as {[key: number]: number});

  const reactionList1 = widget.widgetType.toString() === '1' ? REACTIONS.slice(0, 1) : REACTIONS;

  const myReaction = walletStore.isConnected ? reactionList.find((item: Reaction) => item.ownerAddress === walletStore.walletAddress) : null;


  // const widgetLoader = loadersStore.getLoader('LOAD_WIDGET')
  // const updateReactions = loadersStore.getLoader('UPDATE_REACTIONS')



  return <>
    {/*{widgetLoader.type === LoaderStatus.PROGRESS && <Loader loader={widgetLoader} />}*/}
    {/*{updateReactions.type === LoaderStatus.PROGRESS && <Loader loader={updateReactions} />}*/}
    {reactionList1.map((reaction) => {
      return <ReactionItem
        key={reaction.emojiId}
        onClick={handleClickReaction}
        reaction={reaction}
        // active={!!(widget?.reaction && widget.reaction.emojiId === reaction.emojiId)}
        active={myReaction?.emojiId.toString() === reaction.emojiId.toString()}
        counter={counterMap[reaction.emojiId] || 0}
      />
    })}
  </>;
};

