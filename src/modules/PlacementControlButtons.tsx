import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../stuff/hooks';
import {
  selectLeftOffset,
  selectTopOffset
} from '../stuff/slices/StylingSlice';

import {
  addWord,
  clearChosenSpace,
  selectPreviewHasErrors,
  selectPreviewWord,
  selectRotateLeftButtonCoords
} from '../stuff/slices/WordGridSlice';

import './PlacementControlButtons.css';
import { clearChosenDirection, setGameMode } from '../stuff/slices/GameSlice';
import { GameModes } from '../stuff/Shared';
import { clearChosen } from '../stuff/slices/FoundWordsSlice';
import { CSSProperties } from 'react';

export const ConfirmPlacementButton = () => {
  const rotateLeftButtonCoords = useAppSelector(selectRotateLeftButtonCoords);
  const leftOffset = useAppSelector((state) =>
    selectLeftOffset(state, rotateLeftButtonCoords!)
  );
  const topOffset = useAppSelector((state) =>
    selectTopOffset(state, rotateLeftButtonCoords!)
  );
  const previewWord = useAppSelector(selectPreviewWord);
  const previewHasErrors = useAppSelector(selectPreviewHasErrors);

  const dispatch = useAppDispatch();

  const style: CSSProperties = { left: leftOffset, top: topOffset };

  const onClick = previewHasErrors
    ? undefined
    : () => {
        dispatch(addWord(previewWord));
        dispatch(setGameMode(GameModes.ChoosingLocalLetter));
        dispatch(clearChosen(undefined));
        dispatch(clearChosenDirection(undefined));
        dispatch(clearChosenSpace(undefined));
      };

  return (
    <div
      className={`PlacementControlButton ConfirmPlacementButton`}
      style={style}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
    </div>
  );
};

export const RotateLeftButton = () => {
  const rotateLeftButtonCoords = useAppSelector(selectRotateLeftButtonCoords);
  const leftOffset = useAppSelector((state) =>
    selectLeftOffset(state, rotateLeftButtonCoords!)
  );
  const topOffset = useAppSelector((state) =>
    selectTopOffset(state, rotateLeftButtonCoords!)
  );

  const dispatch = useAppDispatch();

  const style: CSSProperties = { left: leftOffset, top: topOffset };

  const onClick = () => {};

  return (
    <div
      className={`PlacementControlButton RotateLeftButton`}
      style={style}
      onClick={onClick}
    ></div>
  );
};

export const RotateRightButton = () => {
  const dispatch = useAppDispatch();

  const onClick = () => {};

  return (
    <div
      className={`PlacementControlButton RotateRightButton`}
      onClick={onClick}
    ></div>
  );
};
