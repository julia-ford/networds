import { useAppDispatch, useAppSelector } from '../stuff/hooks';
import { GameModes, NWTData } from '../stuff/Shared';
import { chooseLetter } from '../stuff/slices/FoundWordsSlice';
import { selectGameMode } from '../stuff/slices/GameSlice';
import { selectLeftOffset, TILE_UNITS } from '../stuff/slices/StylingSlice';
import { NetwordsTile } from './bulk/NetwordsTile';
import './FoundWordsList.css';

export const FoundWordsList = () => {
  const foundWords = useAppSelector((state) => state.foundWords.foundWords);
  const chosenWord = useAppSelector((state) => state.foundWords.chosenWord);
  const chosenLetter = useAppSelector((state) => state.foundWords.chosenLetter);
  const gameMode = useAppSelector(selectGameMode);

  const dispatch = useAppDispatch();

  // Loop through all the words the player has found in order to draw the rows.
  const wordRows = foundWords.map((foundWord, wordIndex) => {
    // Check if the player has selected a letter in this word for placement.
    const isChosenWord = wordIndex === chosenWord;

    // Loop through the letters within this word in order to draw the tiles.
    const tiles = foundWord.map((tile, tileIndex) => {
      // Check if the player has chosen this letter to place on the board.
      const isChosenLetter = isChosenWord && tileIndex === chosenLetter;

      const chosenClass = isChosenLetter ? 'Chosen' : '';

      // Construct the onClick handler for this tile.
      const onClick = isChosenLetter
        ? undefined
        : () => {
            dispatch(chooseLetter({ wordIndex, letterIndex: tileIndex }));
          };

      const tileData: NWTData = { row: 0, col: tileIndex, letter: tile.letter };
      return (
        <FWTile
          key={`Tile ${tileIndex} of Found Word ${wordIndex}`}
          tileData={tileData}
          className={`FoundWordsTile ${gameMode} ${chosenClass}`}
          onClick={onClick}
        ></FWTile>
      );
    });
    return (
      <div key={`Found Word #${wordIndex}`} className='FoundWordsRow'>
        {tiles}
      </div>
    );
  });

  return (
    <div className='FoundWordsList'>
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
