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

  const dispatch = useAppDispatch();

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

      const tileData: NWTData = { row: 0, col: tileIndex, letter: tile.letter };
      return (
        <FWTile
          key={`Tile ${tileIndex} of Found Word ${foundWord.foundWordIndex}`}
          tileData={tileData}
          className={`FoundWordsTile ${gameMode} ${chosenClass} ${placedClass}`}
          onClick={onClick}
        ></FWTile>
      );
    });

    let unplaceWordButton = null;
    if (isLastPlacedWord) {
      unplaceWordButton = (
        <UnplaceWordButton
          wordLength={foundWord.tiles.length}
        ></UnplaceWordButton>
      );
    }

    return (
      <div
        key={`Found Word #${foundWord.foundWordIndex}`}
        className='FoundWordsRow'
      >
        {tiles}
        {unplaceWordButton}
      </div>
    );
  });

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

  return (
    <div className='FoundWordsList' style={style}>
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
