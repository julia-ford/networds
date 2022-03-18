import { CSSProperties, ReactNode } from 'react';
import { useAppSelector } from '../stuff/hooks';
import {
  selectAcceptedIndex,
  selectAcceptedWordSortedIndex
} from '../stuff/slices/WordInProgressSlice';
import {
  COMPONENT_MARGIN,
  selectUnitSize,
  TILE_DIAMETER,
  TILE_MARGIN_HORZ,
  TILE_UNITS
} from '../stuff/slices/StylingSlice';
import './FlyingAcceptedTiles.css';
import {
  selectNumFoundWords,
  selectSortedFoundWords
} from '../stuff/slices/FoundWordsSlice';

export const FlyingAcceptedTiles = () => {
  const unitSize = useAppSelector(selectUnitSize);
  const acceptedTiles = useAppSelector(
    (state) => state.wordInProgress.acceptedWord
  );
  const numFoundWords = useAppSelector(selectNumFoundWords);
  const sortedFoundWords = useAppSelector(selectSortedFoundWords);
  const sortedIndex = useAppSelector(selectAcceptedWordSortedIndex);

  let tiles: ReactNode[] = [];
  if (numFoundWords > 0 && acceptedTiles && sortedIndex !== undefined) {
    let finalTopOff: number;
    if (numFoundWords === 1) {
      finalTopOff = COMPONENT_MARGIN * unitSize;
    } else if (sortedIndex !== numFoundWords - 1) {
      const wordBelowIndex = sortedFoundWords[sortedIndex + 1].foundWordIndex;
      const rowBelow = document.getElementById(`Found Word #${wordBelowIndex}`);
      if (rowBelow === null) {
        return null;
      }
      finalTopOff =
        rowBelow.getBoundingClientRect().top - TILE_DIAMETER * unitSize;
    } else {
      const wordAboveIndex = sortedFoundWords[sortedIndex - 1].foundWordIndex;
      const rowAbove = document.getElementById(`Found Word #${wordAboveIndex}`);
      if (rowAbove === null) {
        return null;
      }
      finalTopOff =
        rowAbove.getBoundingClientRect().top + COMPONENT_MARGIN * unitSize;
    }

    tiles = acceptedTiles.map((tileData, tileIndex) => {
      const finalRightOff =
        // Offset for each tile.
        ((tileIndex + 1) * TILE_DIAMETER +
          // Ofsset for margins between tiles.
          tileIndex * TILE_MARGIN_HORZ +
          // Offset for the left-margin on the list itself.
          COMPONENT_MARGIN) *
          // Convert to pixels.
          unitSize *
          // Invert because this is a right-offset on the left column.
          -1 -
        // Offset one more pixel for the vertical line divider between columns.
        1;

      const style: CSSProperties = { animation: '' };

      return (
        <div
          key={`Flying Tile #${tileIndex}`}
          className='NetwordsTile WipTileTemp'
          style={{
            right: `${finalRightOff}${TILE_UNITS}`,
            top: `${finalTopOff}${TILE_UNITS}`
          }}
        >
          {tileData.letter}
        </div>
      );
    });
  }

  return <div className='FlyingAcceptedTiles'>{tiles}</div>;
};
