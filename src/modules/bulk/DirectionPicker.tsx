import React, { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightLong, faXmark } from '@fortawesome/free-solid-svg-icons';

import { Directions, GameModes, GetRotation } from '../../stuff/Shared';
import { useAppDispatch, useAppSelector } from '../../stuff/hooks';
import {
  selectLeftOffset,
  selectLeftOffsetForDirPicker,
  selectTopOffset,
  selectTopOffsetForDirPicker,
  TILE_UNITS
} from '../../stuff/slices/StylingSlice';
import { setChosenDirection, setGameMode } from '../../stuff/slices/GameSlice';

import './DirectionPicker.css';
import { clearChosenSpace } from '../../stuff/slices/WordGridSlice';

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

  const leftOffset = useAppSelector((state) => {
    return selectLeftOffsetForDirPicker(state, chosenSpace, direction);
  });
  const topOffset = useAppSelector((state) => {
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
        top: `${topOffset}${TILE_UNITS}`
      }}
    >
      <FontAwesomeIcon
        icon={faRightLong}
        style={{ transform: `rotate(${rotation}deg)` }}
      ></FontAwesomeIcon>
    </div>
  );
};

export const CancelDirPickingButton = () => {
  const chosenSpace = useAppSelector((state) => state.wordGrid.chosenSpace);

  if (!chosenSpace) {
    throw new Error(
      'Attempted to create a direction-picking cancel button without a chosen space.'
    );
  }

  const leftOffset = useAppSelector((state) => {
    return selectLeftOffset(state, chosenSpace);
  });
  const topOffset = useAppSelector((state) => {
    return selectTopOffset(state, chosenSpace);
  });

  const dispatch = useAppDispatch();
  const onClick = useMemo(() => {
    return () => {
      dispatch(setGameMode(GameModes.ChoosingBoardSpace));
      dispatch(clearChosenSpace(undefined));
    };
  }, [dispatch]);

  return (
    <div
      className='CancelDirPickingButton Clickable'
      onClick={onClick}
      style={{
        left: `${leftOffset}${TILE_UNITS}`,
        top: `${topOffset}${TILE_UNITS}`
      }}
    >
      <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
    </div>
  );
};
