import React, { useEffect } from 'react';

import './App.css';

import { LetterCloud } from './modules/LetterCloud';
import { WordGrid } from './modules/WordGrid';
import { WordInProgress } from './modules/WordInProgress';
import { ButtonBar } from './modules/ButtonBar';
import { useAppDispatch, useAppSelector } from './stuff/hooks';
import {
  selectIsMobileSized,
  updateUnitSize
} from './stuff/slices/StylingSlice';
import { FoundWordsList } from './modules/FoundWordsList';

export const App = () => {
  const isMobileSized = useAppSelector(selectIsMobileSized);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const onWindowResize = () => {
      console.log('resizing');
      dispatch(updateUnitSize(undefined));
    };

    window.addEventListener('resize', onWindowResize);
  });

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
      <div className='NWCol'>
        <WordGrid></WordGrid>
        <WordInProgress></WordInProgress>
        <LetterCloud></LetterCloud>
        <ButtonBar></ButtonBar>
      </div>
      {nonMobileContent}
    </div>
  );
};

export default App;
