import React, { CSSProperties, ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '../stuff/hooks';
import { Directions, GameModes } from '../stuff/Shared';
import { setGameMode } from '../stuff/slices/GameSlice';
import {
  chooseWordGridSpace,
  selectWordGridTilesState
} from '../stuff/slices/WordGridSlice';
import { DirectionPicker } from './bulk/DirectionPicker';
import {
  COLOR_BLUE_TRANS,
  GetLeftOffset,
  GetTopOffset,
  NetwordsTile,
  TILE_SHADOW_WIDTH,
  TILE_UNITS
} from './bulk/NetwordsTile';

import './WordGrid.css';

export const WG_WIDTH = 19;
export const WG_HEIGHT = 9;

export const WordGrid = () => {
  const dispatch = useAppDispatch();

  const gameMode = useAppSelector((state) => state.game.gameMode);

  const wordGrid = useAppSelector(selectWordGridTilesState);

  const tiles = wordGrid.map((row, rowIndex) => {
    return row.map((tile, colIndex) => {
      const tileData = { row: rowIndex, col: colIndex };
      const leftOffset = GetLeftOffset(tileData);
      const topOffset = GetTopOffset(tileData);

      let style: CSSProperties = {
        left: `${leftOffset}${TILE_UNITS}`,
        top: `${topOffset}${TILE_UNITS}`
      };
      if (tile?.isChosen) {
        if (tile.candy) {
          style.boxShadow = `0 0 0 ${TILE_SHADOW_WIDTH}${TILE_UNITS} ${tile.candy.color}`;
        } else {
          style.border = `0 0 0 ${TILE_SHADOW_WIDTH}${TILE_UNITS} ${COLOR_BLUE_TRANS}`;
        }
      }
      if (gameMode === GameModes.ConfirmingChoices) {
        if (wordGrid.hasErrors && tile.isInPreview) {
          style.backgroundColor = '#ff0000';
        } else if (tile.isInPreview) {
          style.backgroundColor = '#ffff00';
        }
      }
      let onClick: undefined | (() => void);
      if (gameMode === GameModes.ChoosingBoardSpace && tile.isValidChoice) {
        onClick = () => {
          dispatch(chooseWordGridSpace({ row: rowIndex, col: colIndex }));
          dispatch(setGameMode(GameModes.ChoosingDirection));
        };
      }

      return (
        <NetwordsTile
          key={`WG Tile at (${rowIndex}, ${colIndex})`}
          className='WGTile'
          letter={tile.previewLetter ?? tile.letter}
          candy={tile.candy}
          style={style}
          onClick={onClick}
        ></NetwordsTile>
      );
    });
  });

  let directionPickers: ReactNode[] = [];
  if (gameMode === GameModes.ChoosingDirection) {
    directionPickers = Object.values(Directions).map((dir) => {
      return (
        <DirectionPicker
          key={`direction picker ${dir}`}
          direction={dir}
        ></DirectionPicker>
      );
    });
  }

  return (
    <div className={`WordGrid ${gameMode}`}>
      {tiles}
      {directionPickers}
    </div>
  );
};
