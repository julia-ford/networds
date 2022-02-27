import { useAppSelector } from '../../stuff/hooks';
import { NWTData } from '../../stuff/Shared';
import {
  selectLeftOffsetForConnector,
  selectTopOffsetForConnector
} from '../../stuff/slices/StylingSlice';

import './TileConnector.css';

interface TCProps {
  prev: NWTData;
  next: NWTData;
  fading?: boolean;
}
export const TileConnector = ({ prev, next, fading = false }: TCProps) => {
  const startLeftOffset = useAppSelector((state) => {
    return selectLeftOffsetForConnector(state, prev);
  });
  const startTopOffset = useAppSelector((state) => {
    return selectTopOffsetForConnector(state, prev);
  });

  const endLeftOffset = useAppSelector((state) => {
    return selectLeftOffsetForConnector(state, next);
  });
  const endTopOffset = useAppSelector((state) => {
    return selectTopOffsetForConnector(state, next);
  });

  return (
    <path
      d={`M ${startLeftOffset} ${startTopOffset} L ${endLeftOffset} ${endTopOffset}`}
      className='TileConnector'
      fill='transparent'
      style={{ animation: `${fading ? 'fadeOut' : 'fadeIn'} 0.5s` }}
    ></path>
  );
};
