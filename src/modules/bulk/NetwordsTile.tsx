import { CSSProperties, ReactNode } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { NWTData } from '../../stuff/Shared';
import {
  ODD_ROW_OFFSET,
  TILE_DIAMETER,
  TILE_MARGIN
} from './../../stuff/StylingStuff';

import './NetwordsTile.css';

export interface Candy {
  icon: IconProp;
  colorMain: string;
  colorText: string;
  isValidStart: boolean;
}

interface NTProps {
  letter?: string;
  candy?: Candy;
  className: string;
  onClick?: () => void;
  style?: CSSProperties;
}
export const NetwordsTile = ({
  letter,
  candy,
  className,
  onClick,
  style = {}
}: NTProps) => {
  let content: ReactNode = null;
  if (letter) {
    content = letter;
  } else if (candy) {
    content = (
      <FontAwesomeIcon
        icon={candy.icon}
        color={candy.colorMain}
      ></FontAwesomeIcon>
    );
  }
  return (
    <div
      className={`NetwordsTile ${className} ${onClick ? 'Clickable' : ''}`}
      onClick={onClick}
      style={style}
    >
      {content}
    </div>
  );
};

export const GetLeftOffset = (tileData: NWTData) => {
  return (
    tileData.col * (TILE_DIAMETER + TILE_MARGIN) +
    (tileData.row % 2 === 1 ? ODD_ROW_OFFSET : 0)
  );
};

export const GetTopOffset = (tileData: NWTData) => {
  return tileData.row * (TILE_DIAMETER + TILE_MARGIN);
};
