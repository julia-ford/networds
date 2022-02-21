import React, { CSSProperties, ReactNode } from 'react';

import { useAppDispatch, useAppSelector } from '../stuff/hooks';
import { Directions, GameModes } from '../stuff/Shared';
import {
  COLOR_BLUE_TRANS,
  COLOR_RED_MAIN,
  COLOR_YELLOW_MAIN,
  TILE_SHADOW_WIDTH,
  TILE_UNITS
} from '../stuff/StylingStuff';
import { setGameMode } from '../stuff/slices/GameSlice';
import {
  chooseWordGridSpace,
  selectWordGridTilesState,
  WGTileData
} from '../stuff/slices/WordGridSlice';
import { DirectionPicker } from './bulk/DirectionPicker';
import { GetLeftOffset, GetTopOffset, NetwordsTile } from './bulk/NetwordsTile';

import './WordGrid.css';

export const WordGrid = () => {
  const dispatch = useAppDispatch();

  const gameMode = useAppSelector((state) => state.game.gameMode);

  const wordGrid = useAppSelector(selectWordGridTilesState);

  const tiles = wordGrid.map((row, rowIndex) => {
    return row.map((tile, colIndex) => {
      const tileData = { row: rowIndex, col: colIndex };
      const leftOffset = GetLeftOffset(tileData);
      const topOffset = GetTopOffset(tileData);

      let onClick: undefined | (() => void);
      if (gameMode === GameModes.ChoosingBoardSpace && tile.isValidChoice) {
        onClick = () => {
          dispatch(chooseWordGridSpace({ row: rowIndex, col: colIndex }));
          dispatch(setGameMode(GameModes.ChoosingDirection));
        };
      }

      return (
        <WGTile
          key={`WG Tile at (${rowIndex}, ${colIndex})`}
          wgHasErrors={!!wordGrid.hasErrors}
          wgTileData={tile}
          className={`WGTile ${tile.letter ? 'WithLetter' : ''} ${
            tile.isJunction ? 'Junction' : ''
          }`}
          leftOffset={leftOffset}
          topOffset={topOffset}
          onClick={onClick}
        ></WGTile>
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

interface WGTProps {
  wgHasErrors: boolean;
  wgTileData: WGTileData;
  className: string;
  leftOffset: number;
  topOffset: number;
  onClick?: () => void;
}
const WGTile = ({
  wgHasErrors,
  wgTileData,
  className,
  leftOffset,
  topOffset,
  onClick
}: WGTProps) => {
  // Left and top offsets.
  let style: CSSProperties = {
    left: `${leftOffset}${TILE_UNITS}`,
    top: `${topOffset}${TILE_UNITS}`
  };

  // Chosen tile box-shadow indicator.
  if (wgTileData?.isChosen) {
    if (wgTileData.candy) {
      style.boxShadow = `0 0 0 ${TILE_SHADOW_WIDTH}${TILE_UNITS} ${wgTileData.candy.colorMain}80`;
    } else {
      style.border = `0 0 0 ${TILE_SHADOW_WIDTH}${TILE_UNITS} ${COLOR_BLUE_TRANS}`;
    }
  }

  // Error, preview, and candy background colors.
  if (wgHasErrors && wgTileData.isInPreview) {
    style.backgroundColor = COLOR_RED_MAIN;
    style.color = 'white';
    style.boxShadow = `0 0 0 ${TILE_SHADOW_WIDTH}${TILE_UNITS} ${COLOR_RED_MAIN}80`;
  } else if (wgTileData.isInPreview) {
    style.backgroundColor = COLOR_YELLOW_MAIN;
    style.color = 'black';
    style.boxShadow = `0 0 0 ${TILE_SHADOW_WIDTH}${TILE_UNITS} ${COLOR_YELLOW_MAIN}80`;
  } else if (wgTileData.candy && wgTileData.letter) {
    style.backgroundColor = wgTileData.candy.colorMain;
    style.color = wgTileData.candy.colorText;
  }

  return (
    <NetwordsTile
      candy={wgTileData.candy}
      letter={wgTileData.previewLetter ?? wgTileData.letter}
      className={className}
      onClick={onClick}
      style={style}
    ></NetwordsTile>
  );
};
