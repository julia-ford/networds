import { NWTData } from '../../stuff/Shared';
import { TILE_DIAMETER } from '../../stuff/StylingStuff';
import { GetLeftOffset, GetTopOffset } from './NetwordsTile';

import './TileConnector.css';

interface TCProps {
  prev: NWTData;
  next: NWTData;
  fading?: boolean;
}
export const TileConnector = ({ prev, next, fading = false }: TCProps) => {
  const startLeftOffset = GetLeftOffset(prev) + TILE_DIAMETER / 2;
  const startTopOffset = GetTopOffset(prev) + TILE_DIAMETER / 2;

  const endLeftOffset = GetLeftOffset(next) + TILE_DIAMETER / 2;
  const endTopOffset = GetTopOffset(next) + TILE_DIAMETER / 2;

  return (
    <path
      d={`M ${startLeftOffset} ${startTopOffset} L ${endLeftOffset} ${endTopOffset}`}
      className='TileConnector'
      fill='transparent'
      style={{ animation: `${fading ? 'fadeOut' : 'fadeIn'} 0.5s` }}
    ></path>
  );
};
