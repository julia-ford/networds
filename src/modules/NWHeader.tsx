import { useAppDispatch, useAppSelector } from '../stuff/hooks';
import { GameModes } from '../stuff/Shared';
import { selectGameMode, setGameMode } from '../stuff/slices/GameSlice';
import { selectIsMobileSized } from '../stuff/slices/StylingSlice';
import './NWHeader.css';

export const NWHeader = () => {
  const gameMode = useAppSelector(selectGameMode);
  const isMobileSized = useAppSelector(selectIsMobileSized);

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
  return (
    <div className='NWHeader'>
      <p>Networds</p>
      {switchModeButton}
    </div>
  );
};
