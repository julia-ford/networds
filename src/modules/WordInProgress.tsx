import { useAppDispatch, useAppSelector } from '../stuff/hooks';
import { GameModes, NWTData } from '../stuff/Shared';
import {
  selectLeftOffset,
  selectUnitSize,
  TILE_DIAMETER,
  TILE_MARGIN_HORZ,
  TILE_UNITS
} from '../stuff/slices/StylingSlice';
import { chooseWIPTile } from '../stuff/slices/WordInProgressSlice';
import { setGameMode } from '../stuff/slices/GameSlice';
import { NetwordsTile } from './bulk/NetwordsTile';

import './WordInProgress.css';

export const WordInProgress = () => {
  const gameMode = useAppSelector((state) => state.game.gameMode);
  const tilesFromLetterCloud = useAppSelector(
    (state) => state.wordInProgress.tilesFromLetterCloud
  );
  const unitSize = useAppSelector(selectUnitSize);

  const tiles = tilesFromLetterCloud.map((tileData, index) => {
    const wipTileData: NWTData = {
      row: 0,
      col: index,
      letter: tileData.letter
    };

    return (
      <WIPTile
        key={`WIP Tile #${index}`}
        tileData={wipTileData}
        className={`WIPTile`}
      ></WIPTile>
    );
  });
  return (
    <div
      className={`WordInProgress ${gameMode}`}
      style={{
        width: `${
          tilesFromLetterCloud.length * TILE_DIAMETER * unitSize +
          (tilesFromLetterCloud.length - 1) * TILE_MARGIN_HORZ * unitSize
        }${TILE_UNITS}`
      }}
    >
      {tiles}
    </div>
  );
};

interface WIPTProps {
  tileData: NWTData;
  className: string;
  onClick?: () => void;
}
const WIPTile = ({ tileData, className, onClick }: WIPTProps) => {
  const leftOffset = useAppSelector((state) =>
    selectLeftOffset(state, tileData)
  );

  return (
    <NetwordsTile
      className={className}
      onClick={onClick}
      letter={tileData.letter}
      style={{
        left: `${leftOffset}${TILE_UNITS}`
      }}
    ></NetwordsTile>
  );
};
