import React from 'react';

import './App.css';

import { LetterCloud } from './modules/LetterCloud';
import { WordGrid } from './modules/WordGrid';
import { WordInProgress } from './modules/WordInProgress';
import { ButtonBar } from './modules/ButtonBar';

export const App = () => {
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
