import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  faCheck,
  faRotateLeft,
  faRotateRight,
  faXmark
} from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../stuff/hooks';
import {
  selectLeftOffset,
  selectTopOffset,
  selectUnitSize,
  TILE_DIAMETER,
  TILE_MARGIN_HORZ,
  TILE_MARGIN_VERT,
  TILE_UNITS
} from '../stuff/slices/StylingSlice';

import {
  addWord,
  clearChosenSpace,
  selectPreviewHasErrors,
  selectPreviewWord,
  selectWordGridChosenSpace
} from '../stuff/slices/WordGridSlice';

import './PlacementControlButtons.css';
import {
  chooseNextDirection,
  choosePrevDirection,
  clearChosenDirection,
  selectChosenDirection,
  setGameMode
} from '../stuff/slices/GameSlice';
import { GameModes } from '../stuff/Shared';
import { clearChosen } from '../stuff/slices/FoundWordsSlice';

export const PCBRow = () => {
  const unitSize = useAppSelector(selectUnitSize);
  const direction = useAppSelector(selectChosenDirection);
  const chosenSpaceCoords = useAppSelector(selectWordGridChosenSpace);
  const previewHasErrors = useAppSelector(selectPreviewHasErrors);

  const tileLeftOffset = useAppSelector((state) =>
    selectLeftOffset(state, chosenSpaceCoords ?? { col: -1, row: -1 })
  );
  const tileTopOffset = useAppSelector((state) =>
    selectTopOffset(state, chosenSpaceCoords ?? { col: -1, row: -1 })
  );
  const extraLeftOffset = (TILE_DIAMETER + TILE_MARGIN_HORZ) * unitSize;
  const extraTopOffset = (TILE_DIAMETER + TILE_MARGIN_VERT - 0.5) * unitSize;

  const pcbRowLeftOffset = tileLeftOffset - extraLeftOffset;
  const pcbRowTopOffset = tileTopOffset - extraTopOffset;

  const confirmButton = previewHasErrors ? null : (
    <ConfirmPlacementButton></ConfirmPlacementButton>
  );

  if (direction === undefined || chosenSpaceCoords === undefined) {
    return null;
  }

  return (
    <div
      className='PCBRow'
      style={{
        left: `${pcbRowLeftOffset}${TILE_UNITS}`,
        top: `${pcbRowTopOffset}${TILE_UNITS}`
      }}
    >
      <RotateLeftButton></RotateLeftButton>
      {confirmButton}
      <RotateRightButton></RotateRightButton>
      <CancelPlacementButton></CancelPlacementButton>
    </div>
  );
};

export const ConfirmPlacementButton = () => {
  const previewWord = useAppSelector(selectPreviewWord);
  const previewHasErrors = useAppSelector(selectPreviewHasErrors);

  const dispatch = useAppDispatch();

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
      className={`PlacementControlButton ConfirmPlacementButton Clickable`}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
    </div>
  );
};

export const RotateLeftButton = () => {
  const dispatch = useAppDispatch();

  const onClick = () => {
    dispatch(choosePrevDirection(undefined));
  };

  return (
    <div
      className={`PlacementControlButton RotateButton Clickable`}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faRotateLeft}></FontAwesomeIcon>
    </div>
  );
};

export const RotateRightButton = () => {
  const dispatch = useAppDispatch();

  const onClick = () => {
    dispatch(chooseNextDirection(undefined));
  };

  return (
    <div
      className={`PlacementControlButton RotateButton Clickable`}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faRotateRight}></FontAwesomeIcon>
    </div>
  );
};

export const CancelPlacementButton = () => {
  const dispatch = useAppDispatch();

  const onClick = () => {
    dispatch(clearChosenDirection(undefined));
    dispatch(setGameMode(GameModes.ChoosingDirection));
  };

  return (
    <div
      className={`PlacementControlButton CancelPlacementButton Clickable`}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
    </div>
  );
};
