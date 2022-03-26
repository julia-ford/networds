import {useAppDispatch, useAppSelector} from '../stuff/hooks';
import { selectWgEmojified } from '../stuff/slices/WordGridSlice';

import './NWHeader.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faShareSquare} from '@fortawesome/free-solid-svg-icons';
import {setHappyToastMessage} from '../stuff/slices/GameSlice';

export const NWHeader = () => {
  const wgEmoji = useAppSelector(selectWgEmojified);

  const dispatch = useAppDispatch();

  const onCopyEmojiClicked = () => {
    navigator.clipboard.writeText(wgEmoji).then(() => {
      dispatch(setHappyToastMessage('Game results copied!'));
    });
  };
  const alertEmojiButton = (
    <FontAwesomeIcon onClick={onCopyEmojiClicked} icon={faShareSquare}></FontAwesomeIcon>
  );

  return (
    <div className='NWHeader'>
      <p>Networds <span className={'Clickable'}>{alertEmojiButton}</span></p>
    </div>
  );
};
