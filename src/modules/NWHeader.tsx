import { useAppDispatch, useAppSelector } from '../stuff/hooks';
import { GameModes } from '../stuff/Shared';
import { selectGameMode, setGameMode } from '../stuff/slices/GameSlice';
import './NWHeader.css';

export const NWHeader = () => {
  const gameMode = useAppSelector(selectGameMode);

  const dispatch = useAppDispatch();

  const switchModeButtonText =
    gameMode === GameModes.BuildingWord ? 'Place Words' : 'Find Words';

  const onSwitchModeButtonClicked = () => {
    if (gameMode === GameModes.BuildingWord) {
      dispatch(setGameMode(GameModes.ChoosingLocalLetter));
    } else {
      dispatch(setGameMode(GameModes.BuildingWord));
    }
  };
  return (
    <div className='NWHeader'>
      <p>Networds</p>
      <button className='SwitchModeButton' onClick={onSwitchModeButtonClicked}>
        {switchModeButtonText}
      </button>
    </div>
  );
};
