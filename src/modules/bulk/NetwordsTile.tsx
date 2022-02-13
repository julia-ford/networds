import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode } from 'react';
import { NWTData } from '../../stuff/Shared';
import './NetwordsTile.css';

export const TILE_DIAMETER = 5;
export const TILE_MARGIN = 1;
export const TILE_SHADOW_WIDTH = TILE_MARGIN / 2;
export const ODD_ROW_OFFSET = TILE_DIAMETER / 2 + TILE_MARGIN / 2;
export const TILE_UNITS = 'vh';
export const COLOR_BLUE_MAIN = '#007bff';
export const COLOR_BLUE_TRANS = COLOR_BLUE_MAIN + '80';

export interface Candy {
  icon: IconProp;
  color: string;
  isValidStart: boolean;
}

interface NTProps {
  letter?: string;
  candy?: Candy;
  className: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseOut?: () => void;
  style?: React.CSSProperties;
}
export const NetwordsTile = ({
  letter,
  candy,
  className,
  onClick,
  onMouseEnter,
  onMouseOut,
  style = {}
}: NTProps) => {
  let content: ReactNode = null;
  if (letter) {
    content = letter;
  } else if (candy) {
    content = (
      <FontAwesomeIcon icon={candy.icon} color={candy.color}></FontAwesomeIcon>
    );
  }
  if (letter && candy) {
    style.backgroundColor = candy.color;
  }
  return (
    <div
      className={`NetwordsTile ${className} ${onClick ? 'Clickable' : ''}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseOut={onMouseOut}
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
