import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

import { Directions, GameModes, GetRotation } from '../../stuff/Shared';
import { useAppDispatch, useAppSelector } from '../../stuff/hooks';
import {
  selectLeftOffsetForDirPicker,
  selectTopOffsetForDirPicker,
  TILE_UNITS
} from '../../stuff/slices/StylingSlice';
import { setChosenDirection, setGameMode } from '../../stuff/slices/GameSlice';

import './DirectionPicker.css';

interface DPProps {
  direction: Directions;
}
export const DirectionPicker = ({ direction }: DPProps) => {
  const gameMode = useAppSelector((state) => state.game.gameMode);
  const chosenSpace = useAppSelector((state) => state.wordGrid.chosenSpace);

  const dispatch = useAppDispatch();

  if (!chosenSpace) {
    throw new Error(
      'Attempted to create a direction picker without a chosen space.'
    );
  }

  const rotation = GetRotation(direction);

  let leftOffset = useAppSelector((state) => {
    return selectLeftOffsetForDirPicker(state, chosenSpace, direction);
  });
  let topOffset = useAppSelector((state) => {
    return selectTopOffsetForDirPicker(state, chosenSpace, direction);
  });

  const onClick = () => {
    if (gameMode === GameModes.ChoosingDirection) {
      dispatch(setChosenDirection(direction));
      dispatch(setGameMode(GameModes.ConfirmingChoices));
    }
  };

  return (
    <div
      className='DirectionPicker Clickable'
      onClick={onClick}
      style={{
        left: `${leftOffset}${TILE_UNITS}`,
        top: `${topOffset}${TILE_UNITS}`,
        transform: `rotate(${rotation}deg)`
      }}
    >
      <FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon>
    </div>
  );
};
