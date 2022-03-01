import React from 'react';
import { useAppDispatch, useAppSelector } from '../stuff/hooks';
import { GameModes, IsValidWord } from '../stuff/Shared';
import { addFoundWord } from '../stuff/slices/FoundWordsSlice';
import { clearChosenDirection, setGameMode } from '../stuff/slices/GameSlice';
import {
  addWord,
  clearChosenSpace,
  selectPlacedWordsAsStrings,
  selectPreviewHasErrors,
  selectPreviewWord
} from '../stuff/slices/WordGridSlice';
import {
  clearWordInProgress,
  selectWordInProgressAsString,
  selectWordInProgressLength
} from '../stuff/slices/WordInProgressSlice';

import './ButtonBar.css';

export const ButtonBar = () => {
  const gameMode = useAppSelector((state) => state.game.gameMode);
  const wordInProgressTiles = useAppSelector(
    (state) => state.wordInProgress.tilesFromLetterCloud
  );
  const wordInProgressLength = useAppSelector(selectWordInProgressLength);
  const wordInProgressAsString = useAppSelector(selectWordInProgressAsString);
  const previewTiles = useAppSelector(selectPreviewWord);
  const placedWords = useAppSelector(selectPlacedWordsAsStrings);
  const previewHasErrors = useAppSelector(selectPreviewHasErrors);

  const dispatch = useAppDispatch();

  const isSubmitDisabled =
    gameMode !== GameModes.BuildingWord || wordInProgressLength === 0;

  const isClearDisabled =
    ![
      GameModes.BuildingWord,
      GameModes.ChoosingLocalLetter,
      GameModes.ChoosingBoardSpace,
      GameModes.ChoosingDirection,
      GameModes.ConfirmingChoices
    ].includes(gameMode) || wordInProgressLength === 0;

  const isConfirmDisabled =
    gameMode !== GameModes.ConfirmingChoices || previewHasErrors;

  const onSubmitClicked = () => {
    // Should not be able to hit submit if not in BuildingWord state or if no
    // tiles have been chosen yet, but check anyway, just in case.
    if (gameMode === GameModes.BuildingWord && wordInProgressLength) {
      if (IsValidWord(wordInProgressAsString, placedWords)) {
        const nextStatus = GameModes.ChoosingLocalLetter;
        dispatch(setGameMode(nextStatus));
        dispatch(addFoundWord([...wordInProgressTiles]));
      }
    }
  };

  const onClearClicked = () => {
    dispatch(clearChosenDirection(undefined));
    dispatch(clearChosenSpace(undefined));
    dispatch(clearWordInProgress(undefined));
    dispatch(setGameMode(GameModes.BuildingWord));
  };

  const onConfirmClicked = () => {
    dispatch(addWord(previewTiles));
    onClearClicked();
  };

  return (
    <div className='ButtonBar'>
      <button
        className='ButtonBarSubmit'
        onClick={onSubmitClicked}
        disabled={isSubmitDisabled}
      >
        Submit
      </button>
      <button
        className='ButtonBarClear'
        onClick={onClearClicked}
        disabled={isClearDisabled}
      >
        Clear
      </button>
      <button
        className='ButtonBarConfirm'
        onClick={onConfirmClicked}
        disabled={isConfirmDisabled}
      >
        Confirm
      </button>
    </div>
  );
};
