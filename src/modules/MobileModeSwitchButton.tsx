import { faAlignLeft, faShareNodes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch, useAppSelector } from '../stuff/hooks';
import { GameModes } from '../stuff/Shared';
import { clearChosen } from '../stuff/slices/FoundWordsSlice';
import {
  clearChosenDirection,
  clearErrorToastMessage,
  selectGameMode,
  setGameMode
} from '../stuff/slices/GameSlice';
import { selectIsMobileSized } from '../stuff/slices/StylingSlice';
import { clearChosenSpace } from '../stuff/slices/WordGridSlice';
import { clearWordInProgress } from '../stuff/slices/WordInProgressSlice';

import './MobileModeSwitchButton.css';

export const MobileModeSwitchButton = () => {
  const isMobileSized = useAppSelector(selectIsMobileSized);
  const gameMode = useAppSelector(selectGameMode);

  const dispatch = useAppDispatch();

  if (!isMobileSized) {
    return null;
  }

  const icon = gameMode === GameModes.BuildingWord ? faAlignLeft : faShareNodes;

  const mouseoverMessage = GameModes.BuildingWord
    ? 'Place Found Words'
    : 'Find More Words';

  const onClick = () => {
    const newGameMode =
      gameMode === GameModes.BuildingWord
        ? GameModes.ChoosingLocalLetter
        : GameModes.BuildingWord;

    dispatch(setGameMode(newGameMode));
    dispatch(clearChosen(undefined));
    dispatch(clearChosenSpace(undefined));
    dispatch(clearChosenDirection(undefined));
    dispatch(clearErrorToastMessage(undefined));
    dispatch(clearWordInProgress(undefined));
  };

  return (
    <div
      className='MobileModeSwitchButton Clickable'
      onClick={onClick}
      title={mouseoverMessage}
    >
      <FontAwesomeIcon icon={icon}></FontAwesomeIcon>
    </div>
  );
};
