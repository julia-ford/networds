import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch, useAppSelector } from '../stuff/hooks';
import { selectLeftOffset } from '../stuff/slices/StylingSlice';
import { removeLastWord } from '../stuff/slices/WordGridSlice';

import './UnplaceWordButton.css';

interface UWBProps {
  wordLength: number;
}
export const UnplaceWordButton = ({ wordLength }: UWBProps) => {
  const leftOffset = useAppSelector((state) =>
    selectLeftOffset(state, { row: 0, col: wordLength })
  );
  const dispatch = useAppDispatch();

  const onClick = () => {
    dispatch(removeLastWord(undefined));
  };

  return (
    <div
      className='UnplaceWordButton Clickable'
      onClick={onClick}
      style={{ left: leftOffset }}
    >
      <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
    </div>
  );
};
