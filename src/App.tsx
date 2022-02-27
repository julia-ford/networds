import React, { useEffect } from 'react';

import './App.css';

import { LetterCloud } from './modules/LetterCloud';
import { WordGrid } from './modules/WordGrid';
import { WordInProgress } from './modules/WordInProgress';
import { ButtonBar } from './modules/ButtonBar';
import { useAppDispatch } from './stuff/hooks';
import { updateUnitSize } from './stuff/slices/StylingSlice';

export const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const onWindowResize = () => {
      console.log('resizing');
      dispatch(updateUnitSize(undefined));
    };

    window.addEventListener('resize', onWindowResize);
  });

  return (
    <div className='App'>
      <WordGrid></WordGrid>
      <WordInProgress></WordInProgress>
      <LetterCloud></LetterCloud>
      <ButtonBar></ButtonBar>
    </div>
  );
};

export default App;
