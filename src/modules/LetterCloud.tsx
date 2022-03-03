import React from 'react';

import { useAppSelector } from '../stuff/hooks';
import { NWTData } from '../stuff/Shared';
import {
  LC_DRAW_WIDTH,
  LC_DRAW_HEIGHT,
  TILE_UNITS,
  selectUnitSize
} from '../stuff/slices/StylingSlice';
import { TileConnector } from './bulk/TileConnector';

import './LetterCloud.css';
import { LCDragTile } from './LetterCloudDragTile';

export const LetterCloud = () => {
  const letters = useAppSelector((state) => state.letterCloud.letters);
  const wordInProgress = useAppSelector(
    (state) => state.wordInProgress.tilesFromLetterCloud
  );
  const fadingConnectors = useAppSelector(
    (state) => state.letterCloud.fadingConnectors
  );
  const unitSize = useAppSelector(selectUnitSize);

  const tiles = letters.map((rowOfLetters, row) => {
    return rowOfLetters.map((letter, col) => {
      // If no letter, this is an empty space, so don't make a tile.
      if (!letter) {
        return null;
      }

      const tileData: NWTData = {
        row,
        col,
        letter
      };

      return (
        <LCDragTile
          key={`LetterCloud Tile at (${tileData.row}, ${tileData.col})`}
          myData={tileData}
        ></LCDragTile>
      );
    });
  });

  const connectors = wordInProgress.map((tileData, index) => {
    if (index === 0) {
      return null;
    }
    const prev = wordInProgress[index - 1];
    return (
      <TileConnector
        key={`(${prev.row}, ${prev.col}) to (${tileData.row}, ${tileData.col})`}
        prev={prev}
        next={tileData}
      ></TileConnector>
    );
  });

  return (
    <div className='LetterCloud'>
      {tiles}
      <svg
        width={`${LC_DRAW_WIDTH * unitSize}`}
        height={`${LC_DRAW_HEIGHT * unitSize}`}
        viewBox={`0 0 ${LC_DRAW_WIDTH * unitSize} ${LC_DRAW_HEIGHT * unitSize}`}
        xmlns='http://www.w3.org/2000/svg'
        style={{
          width: `${LC_DRAW_WIDTH * unitSize}${TILE_UNITS}`,
          height: `${LC_DRAW_HEIGHT * unitSize}${TILE_UNITS}`
        }}
      >
        {[...connectors, ...fadingConnectors]}
      </svg>
    </div>
  );
};
