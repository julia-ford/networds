import { useAppDispatch, useAppSelector } from '../stuff/hooks';
import { GameModes } from '../stuff/Shared';
import { TILE_DIAMETER, TILE_MARGIN, TILE_UNITS } from '../stuff/StylingStuff';
import { chooseWIPTile } from '../stuff/slices/WordInProgressSlice';
import { setGameMode } from '../stuff/slices/GameSlice';
import { NetwordsTile } from './bulk/NetwordsTile';

import './WordInProgress.css';

export const WordInProgress = () => {
  const gameMode = useAppSelector((state) => state.game.gameMode);
  const tilesFromLetterCloud = useAppSelector(
    (state) => state.wordInProgress.tilesFromLetterCloud
  );
  const chosenWIPTileIndex = useAppSelector(
    (state) => state.wordInProgress.chosenIndex
  );
  const chosenWordGridSpace = useAppSelector(
    (state) => state.wordGrid.chosenSpace
  );

  const dispatch = useAppDispatch();

  const tiles = tilesFromLetterCloud.map((tileData, index) => {
    const isChosen = chosenWIPTileIndex === index;
    const leftOffset = index * (TILE_DIAMETER + TILE_MARGIN);

    let onClick: undefined | (() => void);
    if (
      !isChosen &&
      (gameMode === GameModes.ChoosingLocalLetter ||
        (gameMode === GameModes.ChoosingBoardSpace && !chosenWordGridSpace))
    ) {
      onClick = () => {
        dispatch(chooseWIPTile(index));
        dispatch(setGameMode(GameModes.ChoosingBoardSpace));
      };
    }

    return (
      <NetwordsTile
        key={`WIP Tile #${index}`}
        letter={tileData.letter!}
        className={`WIPTile ${isChosen ? 'Chosen' : ''}`}
        style={{
          left: `${leftOffset}${TILE_UNITS}`
        }}
        onClick={onClick}
      ></NetwordsTile>
    );
  });
  return (
    <div
      className={`WordInProgress ${gameMode}`}
      style={{
        width: `${
          tilesFromLetterCloud.length * TILE_DIAMETER +
          (tilesFromLetterCloud.length - 1) * TILE_MARGIN
        }${TILE_UNITS}`
      }}
    >
      {tiles}
    </div>
  );
};
