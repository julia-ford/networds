import { CSSProperties, ReactNode } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './NetwordsTile.css';

export interface Candy {
  icon: IconProp;
  colorMain: string;
  colorText: string;
  flip?: boolean;
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
    const iconStyle: CSSProperties = {};
    if (candy.flip) {
      style.transform = 'scaleX(-1)';
    }
    content = (
      <FontAwesomeIcon
        icon={candy.icon}
        color={candy.colorMain}
        style={iconStyle}
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
