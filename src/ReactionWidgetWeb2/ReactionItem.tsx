import React, {useCallback} from 'react';
import styled, {css} from "styled-components";

interface Props {
  reaction: {emoji: string, emojiId: number, counter: number};
  onClick: (emojiId: number) => void
  active: boolean,
  counter: number
}

const Reaction = styled.div<{active: boolean}>`
  padding: 8px 12px;
  border-radius: 24px;
  font-size: 14px;
  cursor: pointer;

  ${(props) => props.active ? css`
    background-color: #0900d945;
    color: #0b00ff;
  ` : ''}

`

export const ReactionItem: React.FC<Props> = ({reaction, active, counter, onClick}) => {
  const handleClick = useCallback(() => {
    onClick(reaction.emojiId)
  }, [onClick, reaction]);

  return <Reaction active={active} onClick={handleClick}>{reaction.emoji} {counter}</Reaction>;
};

