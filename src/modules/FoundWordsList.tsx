import { CSSProperties } from 'react';
import { useAppDispatch, useAppSelector } from '../stuff/hooks';
import { GameModes, NWTData } from '../stuff/Shared';
import {
  chooseLetter,
  selectChosenLetter,
  selectChosenWord,
  selectSortedFoundWords
} from '../stuff/slices/FoundWordsSlice';
import {
  clearChosenDirection,
  selectGameMode,
  setGameMode
} from '../stuff/slices/GameSlice';
import {
  SCREEN_UNITS_TALL_SANS_HEADER,
  selectIsMobileSized,
  selectLeftOffset,
  selectUnitSize,
  TILE_UNITS
} from '../stuff/slices/StylingSlice';
import {
  clearChosenSpace,
  selectLastPlacedWord,
  selectPlacedWordsIndices
} from '../stuff/slices/WordGridSlice';
import {
  clearAnimations,
  selectAcceptedTiles
} from '../stuff/slices/WordInProgressSlice';
import { NetwordsTile } from './bulk/NetwordsTile';

import './FoundWordsList.css';
import { UnplaceWordButton } from './UnplaceWordButton';

export const FoundWordsList = () => {
  const isMobileSized = useAppSelector(selectIsMobileSized);
  const unitSize = useAppSelector(selectUnitSize);
  const foundWords = useAppSelector(selectSortedFoundWords);
  const chosenWord = useAppSelector(selectChosenWord);
  const chosenLetter = useAppSelector(selectChosenLetter);
  const placedIndices = useAppSelector(selectPlacedWordsIndices);
  const lastPlacedWord = useAppSelector(selectLastPlacedWord);
  const gameMode = useAppSelector(selectGameMode);
  const acceptedTiles = useAppSelector(selectAcceptedTiles);

  const dispatch = useAppDispatch();

  // Figure out if we should animate row expansion or not.
  const nonMobileClass = isMobileSized ? '' : 'NonMobile';

  // Loop through all the words the player has found in order to draw the rows.
  const wordRows = foundWords.map((foundWord) => {
    // Check if the player has selected a letter in this word for placement.
    const isChosenWord = foundWord.foundWordIndex === chosenWord;

    const isPlaced = placedIndices.includes(foundWord.foundWordIndex);

    const isLastPlacedWord = foundWord.foundWordIndex === lastPlacedWord;

    // Loop through the letters within this word in order to draw the tiles.
    const tiles = foundWord.tiles.map((tile, tileIndex) => {
      // Check if the player has chosen this letter to place on the board.
      const isChosenLetter = isChosenWord && tileIndex === chosenLetter;

      const chosenClass = isChosenLetter ? 'Chosen' : '';

      const placedClass = isPlaced ? 'Placed' : '';

      // Construct the onClick handler for this tile.
      const onClick =
        isChosenLetter || isPlaced
          ? undefined
          : () => {
              dispatch(
                chooseLetter({
                  wordIndex: foundWord.foundWordIndex,
                  letterIndex: tileIndex
                })
              );
              dispatch(setGameMode(GameModes.ChoosingBoardSpace));
              dispatch(clearChosenDirection(undefined));
              dispatch(clearChosenSpace(undefined));
            };

      // Made tile data so standard tile drawing can handle it.
      const tileData: NWTData = { row: 0, col: tileIndex, letter: tile.letter };

      // Make the tile.
      return (
        <FWTile
          key={`Tile ${tileIndex} of Found Word ${foundWord.foundWordIndex}`}
          tileData={tileData}
          className={`FoundWordsTile ${gameMode} ${chosenClass} ${placedClass} ${nonMobileClass}`}
          onClick={onClick}
        ></FWTile>
      );
    });

    // Make a button to allow word-removal if this is the last-placed word.
    let unplaceWordButton = null;
    if (isLastPlacedWord) {
      unplaceWordButton = (
        <UnplaceWordButton
          wordLength={foundWord.tiles.length}
        ></UnplaceWordButton>
      );
    }

    // Make the word row.
    return (
      <div
        key={`Found Word #${foundWord.foundWordIndex}`}
        id={`Found Word #${foundWord.foundWordIndex}`}
        className={`FoundWordsRow ${nonMobileClass}`}
      >
        {tiles}
        {unplaceWordButton}
      </div>
    );
  });

  // Determine appropriate component size based on layout.
  const heightString = `${
    SCREEN_UNITS_TALL_SANS_HEADER * unitSize
  }${TILE_UNITS}`;
  const style: undefined | CSSProperties = isMobileSized
    ? undefined
    : {
        height: heightString,
        minHeight: heightString,
        maxHeight: heightString
      };

  // If the user scrolls while we're trying to animate the accepted tiles
  // flying over to the found word list, cancel the animation.
  const onScroll =
    acceptedTiles === undefined
      ? undefined
      : () => {
          console.log('scroll detected; clearing animations');
          dispatch(clearAnimations(undefined));
        };

  // Make the found word list.
  return (
    <div className={`FoundWordsList`} style={style} onScroll={onScroll}>
      <div className='FoundWordsSpacer'></div>
      {wordRows}
    </div>
  );
};

interface FWTProps {
  tileData: NWTData;
  className: string;
  onClick?: () => void;
}
const FWTile = ({ tileData, className, onClick }: FWTProps) => {
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
