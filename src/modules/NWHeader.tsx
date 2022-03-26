import { useAppSelector } from '../stuff/hooks';
import { selectWgEmojified } from '../stuff/slices/WordGridSlice';

import './NWHeader.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faShareSquare} from '@fortawesome/free-solid-svg-icons';

export const NWHeader = () => {
  const wgEmoji = useAppSelector(selectWgEmojified);

  const onCopyEmojiClicked = () => {
    navigator.clipboard.writeText(wgEmoji).then(() => {
      // TODO toast this with some happy toast instead of the error toast
      console.log("Copied!");
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
