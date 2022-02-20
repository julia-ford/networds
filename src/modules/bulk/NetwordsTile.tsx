import { CSSProperties, ReactNode } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NWTData } from '../../stuff/Shared';
import './NetwordsTile.css';

export const TILE_DIAMETER = 5;
export const TILE_MARGIN = 1;
export const TILE_SHADOW_WIDTH = TILE_MARGIN / 2;
export const ODD_ROW_OFFSET = TILE_DIAMETER / 2 + TILE_MARGIN / 2;
export const TILE_UNITS = 'vh';

export const COLOR_BLUE_MAIN = '#007bff';
export const COLOR_BLUE_TRANS = COLOR_BLUE_MAIN + '80';
export const COLOR_ERROR = '#dc3545';
export const COLOR_PREVIEW = '#ffc107';
export const COLOR_GREEN_MAIN = '#28a745';
export const COLOR_PURPLE_MAIN = '#9c27b0';

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
