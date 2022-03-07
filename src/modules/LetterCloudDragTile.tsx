import { useAppDispatch, useAppSelector } from '../stuff/hooks';
import {
  AreTilesAdjacent,
  AreTilesSame,
  GameModes,
  NWTData
} from '../stuff/Shared';
import { clearChosen } from '../stuff/slices/FoundWordsSlice';
import {
  clearChosenDirection,
  selectGameMode,
  setGameMode,
  startDragging
} from '../stuff/slices/GameSlice';
import {
  selectLeftOffset,
  selectTopOffset
} from '../stuff/slices/StylingSlice';
import { clearChosenSpace } from '../stuff/slices/WordGridSlice';
import {
  addTileToWordInProgress,
  removeLastTile,
  selectLastWipTile,
  selectSecondToLastWipTile,
  selectDoesWipContain
} from '../stuff/slices/WordInProgressSlice';

interface LCDTProps {
  myData: NWTData;
}
export const LCDragTile = ({ myData }: LCDTProps) => {
  const leftOffset = useAppSelector((state) => selectLeftOffset(state, myData));
  const topOffset = useAppSelector((state) => selectTopOffset(state, myData));
  const gameMode = useAppSelector(selectGameMode);
  const isChosen = useAppSelector((state) =>
    selectDoesWipContain(state, myData)
  );
  const lastTile = useAppSelector(selectLastWipTile);
  const isAdjacentToLastTile = !!lastTile && AreTilesAdjacent(lastTile, myData);
  const secondToLastTile = useAppSelector(selectSecondToLastWipTile);
  const isSecondToLast =
    !!secondToLastTile && AreTilesSame(myData, secondToLastTile);
  const isDragging = useAppSelector((state) => state.game.isDraggingLCTiles);

  const dispatch = useAppDispatch();

  const shouldChooseOnMouseDown = !isDragging && !isChosen && !lastTile;
  const shouldChooseOnOver = isDragging && !isChosen && isAdjacentToLastTile;
  const shouldUnchooseLastOnOver = isDragging && isSecondToLast;

  const clickableClass = shouldChooseOnMouseDown ? 'Clickable' : '';
  const chosenClass = isChosen ? 'Chosen' : '';

  let onMouseOver: (() => void) | undefined;
  if (shouldChooseOnOver) {
    console.log('adding mouse over for tile');
    onMouseOver = () => {
      dispatch(addTileToWordInProgress(myData));
    };
  } else if (shouldUnchooseLastOnOver) {
    onMouseOver = () => {
      dispatch(removeLastTile(undefined));
    };
  }

  let onMouseDown: (() => void) | undefined;
  if (shouldChooseOnMouseDown) {
    onMouseDown = () => {
      dispatch(startDragging(undefined));
      dispatch(addTileToWordInProgress(myData));
      dispatch(setGameMode(GameModes.BuildingWord));
      dispatch(clearChosen(undefined));
      dispatch(clearChosenDirection(undefined));
      dispatch(clearChosenSpace(undefined));
    };
  }

  return (
    <div
      className={`NetwordsTile LCTile ${chosenClass} ${clickableClass} ${gameMode}`}
      onMouseOver={onMouseOver}
      onMouseDown={onMouseDown}
      onTouchStart={onMouseDown}
      style={{ left: leftOffset, top: topOffset }}
    >
      {myData.letter}
    </div>
  );
};
