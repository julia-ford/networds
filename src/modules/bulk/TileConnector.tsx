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
}
export const TileConnector = ({ prev, next }: TCProps) => {
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
    ></path>
  );
};
