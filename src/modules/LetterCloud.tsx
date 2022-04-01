import React from 'react';

import { useAppSelector } from '../stuff/hooks';
import { NWTData } from '../stuff/Shared';
import {
  LC_UNITS_WIDE,
  LC_UNITS_HIGH,
  TILE_UNITS,
  selectUnitSize
} from '../stuff/slices/StylingSlice';
import { selectWipTiles } from '../stuff/slices/WordInProgressSlice';
import { ConnectorMode, TileConnector } from './bulk/TileConnector';

import './LetterCloud.css';
import { LCDragTile } from './LetterCloudDragTile';

export const LetterCloud = () => {
  const letters = useAppSelector((state) => state.letterCloud.letters);
  const wordInProgress = useAppSelector(selectWipTiles);
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
        mode={ConnectorMode.LC}
      ></TileConnector>
    );
  });

  return (
    <div className='LetterCloudHolder'>
      <div className='LetterCloudBackground'></div>
      <div className='LetterCloud'>
        {tiles}
        <svg
          width={`${LC_UNITS_WIDE * unitSize}`}
          height={`${LC_UNITS_HIGH * unitSize}`}
          viewBox={`0 0 ${LC_UNITS_WIDE * unitSize} ${
            LC_UNITS_HIGH * unitSize
          }`}
          xmlns='http://www.w3.org/2000/svg'
          style={{
            width: `${LC_UNITS_WIDE * unitSize}${TILE_UNITS}`,
            height: `${LC_UNITS_HIGH * unitSize}${TILE_UNITS}`
          }}
        >
          {connectors}
        </svg>
      </div>
    </div>
  );
};
