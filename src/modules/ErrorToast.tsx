import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppSelector } from '../stuff/hooks';

import './ErrorToast.css';

export const ErrorToast = () => {
  const errorMessage = useAppSelector((state) => state.game.errorToastMessage);

  if (errorMessage === undefined) {
    return null;
  }

  return (
    <div className={`ErrorToast`}>
      {errorMessage}
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
