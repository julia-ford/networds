import { useAppSelector } from '../stuff/hooks';
import { NWTData } from '../stuff/Shared';
import { selectLeftOffset, TILE_UNITS } from '../stuff/slices/StylingSlice';
import { NetwordsTile } from './bulk/NetwordsTile';
import './FoundWordsList.css';

export const FoundWordsList = () => {
  const foundWords = useAppSelector((state) => state.foundWords.foundWords);

  const wordRows = foundWords.map((foundWord, wordIndex) => {
    const tiles = foundWord.map((tile, tileIndex) => {
      const tileData: NWTData = { row: 0, col: tileIndex, letter: tile.letter };
      return (
        <FWTile
          key={`Tile ${tileIndex} of Found Word ${wordIndex}`}
          tileData={tileData}
          className='FoundWordsTile'
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
