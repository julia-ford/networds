import React, { useEffect } from 'react';

import './App.css';

import { LetterCloud } from './modules/LetterCloud';
import { WordGrid } from './modules/WordGrid';
import { useAppDispatch, useAppSelector } from './stuff/hooks';
import {
  selectIsMobileSized,
  updateUnitSize
} from './stuff/slices/StylingSlice';
import { FoundWordsList } from './modules/FoundWordsList';
import { selectGameMode, stopDragging } from './stuff/slices/GameSlice';
import { GameModes, IsValidWord, TilesToString } from './stuff/Shared';
import { addFoundWord, clearChosen } from './stuff/slices/FoundWordsSlice';
import { clearWordInProgress } from './stuff/slices/WordInProgressSlice';
import { AppDispatch, RootState } from './stuff/store';
import { NWHeader } from './modules/NWHeader';
import { WordInProgress } from './modules/WordInProgress';

export const App = () => {
  const gameMode = useAppSelector(selectGameMode);
  const isMobileSized = useAppSelector(selectIsMobileSized);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const onWindowResize = () => {
      dispatch(updateUnitSize(undefined));
    };

    const tryAddingWipToFoundWords = (
      dispatch: AppDispatch,
      getState: () => RootState
    ) => {
      // logic here that can dispatch actions or read state
      const state = getState();
      const wipTiles = state.wordInProgress.tilesFromLetterCloud;
      const wipString = TilesToString(wipTiles);
      const foundWordsTiles = state.foundWords.foundWords;
      const foundWordsStrings = foundWordsTiles.map((word) =>
        TilesToString(word)
      );
      const isWipValid = IsValidWord(wipString, foundWordsStrings);

      if (isWipValid) {
        dispatch(addFoundWord(wipTiles));
        dispatch(clearChosen(undefined));
      }
    };

    const onMouseUp = () => {
      dispatch(stopDragging(undefined));
      dispatch(tryAddingWipToFoundWords);
      dispatch(clearWordInProgress(undefined));
    };

    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mouseup', onMouseUp);
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
      gameMode === GameModes.ChoosingDirection)
  ) {
    bottomContent = <FoundWordsList></FoundWordsList>;
  }

  const nonMobileContent = isMobileSized ? null : (
    <>
      <div className='VertLine'></div>
      <div className='NWCol'>
        <FoundWordsList></FoundWordsList>
        <div>rotation controls and/or placed words list</div>
      </div>
    </>
  );

  return (
    <div className='App'>
      <NWHeader></NWHeader>
      <div className='NWRowOfCols'>
        <div className='NWCol'>
          <WordGrid></WordGrid>
          {bottomContent}
        </div>
        {nonMobileContent}
      </div>
    </div>
  );
};

export default App;
