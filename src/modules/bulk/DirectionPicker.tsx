import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

import { Directions, GameModes } from '../../stuff/Shared';
import { useAppDispatch, useAppSelector } from '../../stuff/hooks';
import {
  ODD_ROW_OFFSET,
  TILE_DIAMETER,
  TILE_MARGIN,
  TILE_UNITS
} from '../../stuff/StylingStuff';
import { setChosenDirection, setGameMode } from '../../stuff/slices/GameSlice';
import { GetLeftOffset, GetTopOffset } from './NetwordsTile';

import './DirectionPicker.css';

interface DPProps {
  direction: Directions;
}
export const DirectionPicker = ({ direction }: DPProps) => {
  const gameMode = useAppSelector((state) => state.game.gameMode);
  const chosenSpace = useAppSelector((state) => state.wordGrid.chosenSpace);

  const dispatch = useAppDispatch();

  if (!chosenSpace) {
    return null;
  }

  let leftOffset = GetLeftOffset(chosenSpace);
  let topOffset = GetTopOffset(chosenSpace);
  let rotation = 0;
  if (direction === Directions.East) {
    leftOffset += TILE_MARGIN + TILE_DIAMETER;
  } else if (direction === Directions.West) {
    leftOffset -= TILE_MARGIN + TILE_DIAMETER;
    rotation = 180;
  } else if (direction === Directions.Northeast) {
    leftOffset += ODD_ROW_OFFSET;
    topOffset -= TILE_MARGIN + TILE_DIAMETER;
    rotation = 300;
  } else if (direction === Directions.Southeast) {
    leftOffset += ODD_ROW_OFFSET;
    topOffset += TILE_MARGIN + TILE_DIAMETER;
    rotation = 60;
  } else if (direction === Directions.Northwest) {
    leftOffset -= ODD_ROW_OFFSET;
    topOffset -= TILE_MARGIN + TILE_DIAMETER;
    rotation = 240;
  } else if (direction === Directions.Southwest) {
    leftOffset -= ODD_ROW_OFFSET;
    topOffset += TILE_MARGIN + TILE_DIAMETER;
    rotation = 120;
  }

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
