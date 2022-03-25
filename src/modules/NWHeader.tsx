import { useAppDispatch, useAppSelector } from '../stuff/hooks';
import { GameModes } from '../stuff/Shared';
import { selectGameMode, setGameMode } from '../stuff/slices/GameSlice';
import { selectIsMobileSized } from '../stuff/slices/StylingSlice';
import { selectWgEmojified } from '../stuff/slices/WordGridSlice';

import './NWHeader.css';

export const NWHeader = () => {
  const wgEmoji = useAppSelector(selectWgEmojified);

  // TODO: Make this actually work and put it on the bar.
  const onCopyEmojiClicked = () => {
    alert(wgEmoji);
  };
  const alertEmojiButton = (
    <button onClick={onCopyEmojiClicked}>copy emoji</button>
  );

  return (
    <div className='NWHeader'>
      <p>Networds</p>
    </div>
  );
};
