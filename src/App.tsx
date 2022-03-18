import React, { useEffect } from 'react';

import './App.css';

import { LetterCloud } from './modules/LetterCloud';
import { WordGrid } from './modules/WordGrid';
import { useAppDispatch, useAppSelector } from './stuff/hooks';
import {
  selectIsMobileSized,
  updateUnitSize,
  updateIsMobileSized
} from './stuff/slices/StylingSlice';
import { FoundWordsList } from './modules/FoundWordsList';
import { selectGameMode, stopDragging } from './stuff/slices/GameSlice';
import { GameModes } from './stuff/Shared';
import { addFoundWord, clearChosen } from './stuff/slices/FoundWordsSlice';
import {
  clearWordInProgress,
  selectWipTiles,
  selectIsWipValid,
  acceptWord,
  rejectWord,
  clearAnimations
} from './stuff/slices/WordInProgressSlice';
import { AppDispatch, RootState } from './stuff/store';
import { NWHeader } from './modules/NWHeader';
import { WordInProgress } from './modules/WordInProgress';
import { FlyingAcceptedTiles } from './modules/FlyingAcceptedTiles';

export const App = () => {
  const gameMode = useAppSelector(selectGameMode);
  const isMobileSized = useAppSelector(selectIsMobileSized);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const onWindowResize = () => {
      dispatch(updateUnitSize(undefined));
      dispatch(updateIsMobileSized(undefined));
      dispatch(clearAnimations(undefined));
    };

    const tryAddingWipToFoundWords = (
      dispatch: AppDispatch,
      getState: () => RootState
    ) => {
      const state = getState();
      const wipTiles = selectWipTiles(state);
      const isWipValid = selectIsWipValid(state);

      if (isWipValid) {
        dispatch(acceptWord(undefined));
        dispatch(addFoundWord(wipTiles));
        dispatch(clearChosen(undefined));
      } else {
        dispatch(rejectWord(undefined));
      }
    };

    const onMouseUp = () => {
      dispatch(stopDragging(undefined));
      dispatch(tryAddingWipToFoundWords);
      dispatch(clearWordInProgress(undefined));
    };

    const onTouchMove = (ev: TouchEvent) => {
      const touch = ev.touches[0];
      const element = document.elementFromPoint(touch.clientX, touch.clientY);

      if (element !== null) {
        const mouseoverEvent = new MouseEvent('mouseover', {
          view: window,
          bubbles: true,
          cancelable: true
        });

        element.dispatchEvent(mouseoverEvent);
      }
    };

    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchend', onMouseUp);
    window.addEventListener('touchmove', onTouchMove);
  }, [dispatch]);

  let bottomContent = (
    <>
      <WordInProgress></WordInProgress>
      <LetterCloud></LetterCloud>
    </>
  );

  if (
    isMobileSized &&
    (gameMode === GameModes.ChoosingLocalLetter ||
      gameMode === GameModes.ChoosingBoardSpace ||
      gameMode === GameModes.ChoosingDirection)
  ) {
    bottomContent = <FoundWordsList></FoundWordsList>;
  }

  const nonMobileContent = isMobileSized ? null : (
    <>
      <div className='VertLine'></div>
      <div className='NWCol'>
        <FoundWordsList></FoundWordsList>
      </div>
    </>
  );

  return (
    <div className='App'>
      <NWHeader></NWHeader>
      <div className='NWRowOfCols'>
        <div className='NWCol' style={{ flexGrow: 1 }}>
          <WordGrid></WordGrid>
          {bottomContent}
          <FlyingAcceptedTiles></FlyingAcceptedTiles>
        </div>
        {nonMobileContent}
      </div>
    </div>
  );
};

export default App;
