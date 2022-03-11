import { useAppSelector } from '../../stuff/hooks';
import { NWTData } from '../../stuff/Shared';
import {
  selectLeftOffsetForLCConnector,
  selectLeftOffsetForWGConnector,
  selectTopOffsetForLCConnector,
  selectTopOffsetForWGConnector
} from '../../stuff/slices/StylingSlice';

import './TileConnector.css';

export enum ConnectorMode {
  WG = 'Word Grid',
  LC = 'Letter Cloud'
}

interface TCProps {
  prev: NWTData;
  next: NWTData;
  mode: ConnectorMode;
}
export const TileConnector = ({ prev, next, mode }: TCProps) => {
  const startLeftOffsetWG = useAppSelector((state) => {
    return selectLeftOffsetForWGConnector(state, prev);
  });
  const startLeftOffsetLC = useAppSelector((state) => {
    return selectLeftOffsetForLCConnector(state, prev);
  });
  const startLeftOffset =
    mode === ConnectorMode.WG ? startLeftOffsetWG : startLeftOffsetLC;

  const startTopOffsetWG = useAppSelector((state) => {
    return selectTopOffsetForWGConnector(state, prev);
  });
  const startTopOffsetLC = useAppSelector((state) => {
    return selectTopOffsetForLCConnector(state, prev);
  });
  const startTopOffset =
    mode === ConnectorMode.WG ? startTopOffsetWG : startTopOffsetLC;

  const endLeftOffsetWG = useAppSelector((state) => {
    return selectLeftOffsetForWGConnector(state, next);
  });
  const endLeftOffsetLC = useAppSelector((state) => {
    return selectLeftOffsetForLCConnector(state, next);
  });
  const endLeftOffset =
    mode === ConnectorMode.WG ? endLeftOffsetWG : endLeftOffsetLC;

  const endTopOffsetWG = useAppSelector((state) => {
    return selectTopOffsetForWGConnector(state, next);
  });
  const endTopOffsetLC = useAppSelector((state) => {
    return selectTopOffsetForLCConnector(state, next);
  });
  const endTopOffset =
    mode === ConnectorMode.WG ? endTopOffsetWG : endTopOffsetLC;

  return (
    <path
      d={`M ${startLeftOffset} ${startTopOffset} L ${endLeftOffset} ${endTopOffset}`}
      className='TileConnector'
      fill='transparent'
    ></path>
  );
};
