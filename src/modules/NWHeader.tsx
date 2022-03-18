import { useAppDispatch, useAppSelector } from '../stuff/hooks';
import { GameModes } from '../stuff/Shared';
import { selectGameMode, setGameMode } from '../stuff/slices/GameSlice';
import { selectIsMobileSized } from '../stuff/slices/StylingSlice';
import { selectWgEmojified } from '../stuff/slices/WordGridSlice';

import './NWHeader.css';

export const NWHeader = () => {
  const gameMode = useAppSelector(selectGameMode);
  const isMobileSized = useAppSelector(selectIsMobileSized);
  const wgEmoji = useAppSelector(selectWgEmojified);

  const dispatch = useAppDispatch();
  let switchModeButton = null;
  if (isMobileSized) {
    const switchModeButtonText =
      gameMode === GameModes.BuildingWord ? 'Place Words' : 'Find Words';

    const onSwitchModeButtonClicked = () => {
      if (gameMode === GameModes.BuildingWord) {
        dispatch(setGameMode(GameModes.ChoosingLocalLetter));
      } else {
        dispatch(setGameMode(GameModes.BuildingWord));
      }
    };
    switchModeButton = (
      <button className='SwitchModeButton' onClick={onSwitchModeButtonClicked}>
        {switchModeButtonText}
      </button>
    );
  }

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
      {switchModeButton}
    </div>
  );
};
