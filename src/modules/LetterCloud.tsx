import React from 'react';
import './LetterCloud.css';
import {
  NetwordsTile,
  TILE_DIAMETER,
  TILE_MARGIN,
  TILE_UNITS,
  GetLeftOffset,
  GetTopOffset
} from './bulk/NetwordsTile';
import { AreTilesAdjacent, GameModes, NWTData } from '../stuff/Shared';
import { TileConnector } from './bulk/TileConnector';
import { useAppDispatch, useAppSelector } from '../stuff/hooks';
import {
  dequeueConnector,
  enqueueConnector
} from '../stuff/slices/LetterCloudSlice';
import {
  addTileToWordInProgress,
  selectIsLastTileInWIP,
  removeLastTile,
  wipContains
} from '../stuff/slices/WordInProgressSlice';

const CLOUD_DIAM = TILE_DIAMETER * 5 + TILE_MARGIN * 6;

export const LetterCloud = () => {
  const letters = useAppSelector((state) => state.letterCloud.letters);
  const wordInProgress = useAppSelector(
    (state) => state.wordInProgress.tilesFromLetterCloud
  );
  const fadingConnectors = useAppSelector(
    (state) => state.letterCloud.fadingConnectors
  );

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
        <LCTile
          key={`LetterCloud Tile at (${tileData.row}, ${tileData.col})`}
          tileData={tileData}
        ></LCTile>
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
        width={`${CLOUD_DIAM}`}
        height={`${CLOUD_DIAM}`}
        viewBox={`0 0 ${CLOUD_DIAM} ${CLOUD_DIAM}`}
        xmlns='http://www.w3.org/2000/svg'
        style={{
          width: `${CLOUD_DIAM}${TILE_UNITS}`,
          height: `${CLOUD_DIAM}${TILE_UNITS}`
        }}
      >
        {[...connectors, ...fadingConnectors]}
      </svg>
    </div>
  );
};

/**
 * Checks if a given letter cloud tile is a legal choice for the next letter in
 * the word in progress. Verifies that tile is adjacent to the previous chosen
 * tile (if any) and verifies that the tile is not already chosen.
 *
 * Does not check the status of the game; this only verifies that the given
 * tile would be a legal choice if we are allowed to pick tiles right now.
 * Does not check if we are currently in {@link GameModes.BuildingWord BuildingWord} mode.
 * @param potentialChoice Row, col, and letter of the tile we're trying to choose.
 * @param wordInProgress The tile data of the tiles in the word in progress.
 * @returns true if the tile is a legal choice, or false otherwise
 */
export const CanChooseTile = (
  potentialChoice: NWTData,
  wordInProgress: NWTData[]
) => {
  if (wordInProgress.length === 0) {
    return true;
  }

  if (
    wordInProgress.find((wipTileData) => {
      return (
        potentialChoice.row === wipTileData.row &&
        potentialChoice.col === wipTileData.col
      );
    })
  ) {
    return false;
  }

  return AreTilesAdjacent(
    wordInProgress[wordInProgress.length - 1],
    potentialChoice
  );
};

interface LCTProps {
  tileData: NWTData;
}
const LCTile = ({ tileData }: LCTProps) => {
  const gameMode = useAppSelector((state) => state.game.gameMode);
  const isChosen = useAppSelector((state) => wipContains(state, tileData));
  const isLastTile = useAppSelector((state) =>
    selectIsLastTileInWIP(state, tileData)
  );
  const wordInProgress = useAppSelector(
    (state) => state.wordInProgress.tilesFromLetterCloud
  );

  const dispatch = useAppDispatch();

  const leftOffset = GetLeftOffset(tileData);
  const topOffset = GetTopOffset(tileData);

  let onClick: undefined | (() => void);
  // Make sure we're in word-building mode.
  if (gameMode === GameModes.BuildingWord) {
    // If the tile is already chosen, try to unchoose it.
    if (isChosen) {
      // Make sure this is the most recently chosen tile.
      if (isLastTile) {
        onClick = () => {
          // Remove the most recent tile from the word in progress.
          dispatch(removeLastTile(undefined));

          // Make the connector fade out prettily.
          if (wordInProgress.length > 1) {
            const prev = wordInProgress[wordInProgress.length - 2];
            dispatch(
              enqueueConnector(
                <TileConnector
                  key={`(${prev.row}, ${prev.col}) to (${tileData.row}, ${tileData.col})`}
                  prev={prev}
                  next={tileData}
                  fading={true}
                ></TileConnector>
              )
            );
            setTimeout(() => {
              dispatch(dequeueConnector(undefined));
            }, 499);
          }
        };
      }
    } /* attempting to choose a new tile */ else {
      // Check if this is a valid tile to choose.
      if (CanChooseTile(tileData, wordInProgress)) {
        onClick = () => {
          // Add the tile to the word in progress.
          dispatch(addTileToWordInProgress(tileData));
        };
      }
    }
  }

  return (
    <NetwordsTile
      letter={tileData.letter}
      className={`${isChosen ? 'Chosen' : ''} LCTile`}
      style={{
        left: `${leftOffset}${TILE_UNITS}`,
        top: `${topOffset}${TILE_UNITS}`
      }}
      onClick={onClick}
    ></NetwordsTile>
  );
};
