import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppSelector } from '../stuff/hooks';

import './HappyToast.css';

export const HappyToast = () => {
  const happyMessage = useAppSelector((state) => state.game.happyToastMessage);

  if (happyMessage === undefined) {
    return null;
  }

  return (
    <div className={`HappyToast`}>
      {happyMessage}
      <FontAwesomeIcon
        icon={faXmark}
        style={{
          position: 'absolute',
          right: 'var(--component-margin)',
          top: 'var(--component-margin)'
        }}
      ></FontAwesomeIcon>
    </div>
  );
};
