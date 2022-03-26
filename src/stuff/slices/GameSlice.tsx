import React from 'react';
import {
  createSlice,
  SliceCaseReducers,
  PayloadAction,
  createSelector
} from '@reduxjs/toolkit';

import {
  Directions,
  GameModes,
  GetNextDirection,
  GetOppositeDirection,
  GetPrevDirection
} from '../Shared';
import { RootState } from '../store';

interface GameState {
  gameMode: GameModes;
  isDraggingLCTiles: boolean;
  chosenDirection?: Directions;
  errorToastMessage?: string;
  happyToastMessage?: string;
}
const gameSlice = createSlice<GameState, SliceCaseReducers<GameState>>({
  name: 'letterCloud',
  initialState: {
    gameMode: GameModes.BuildingWord,
    isDraggingLCTiles: false
  },
  reducers: {
    setGameMode: (state, action: PayloadAction<GameModes>) => {
      state.gameMode = action.payload;
    },
    startDragging: (state) => {
      state.isDraggingLCTiles = true;
    },
    stopDragging: (state) => {
      state.isDraggingLCTiles = false;
    },
    setChosenDirection: (state, action: PayloadAction<Directions>) => {
      state.chosenDirection = action.payload;
    },
    chooseNextDirection: (state) => {
      if (state.chosenDirection) {
        state.chosenDirection = GetNextDirection(state.chosenDirection);
      }
    },
    choosePrevDirection: (state) => {
      if (state.chosenDirection) {
        state.chosenDirection = GetPrevDirection(state.chosenDirection);
      }
    },
    clearChosenDirection: (state) => {
      state.chosenDirection = undefined;
    },
    setErrorToastMessage: (state, action: PayloadAction<string>) => {
      state.errorToastMessage = action.payload;
      state.happyToastMessage = undefined;
    },
    clearErrorToastMessage: (state) => {
      state.errorToastMessage = undefined;
    },
    setHappyToastMessage: (state, action: PayloadAction<string>) => {
      state.happyToastMessage = action.payload;
      state.errorToastMessage = undefined;
    },
    clearHappyToastMessage: (state) => {
      state.happyToastMessage = undefined;
    }
  }
});

export const selectGameMode = (state: RootState) => state.game.gameMode;

export const selectChosenDirection = (state: RootState) =>
  state.game.chosenDirection;

export const selectOppositeDirection = createSelector(
  [selectChosenDirection],
  (chosenDir) => {
    if (chosenDir === undefined) {
      return undefined;
    }
    return GetOppositeDirection(chosenDir);
  }
);

export const {
  setGameMode,
  startDragging,
  stopDragging,
  setChosenDirection,
  chooseNextDirection,
  choosePrevDirection,
  clearChosenDirection,
  setErrorToastMessage,
  clearErrorToastMessage,
  setHappyToastMessage,
  clearHappyToastMessage
} = gameSlice.actions;

export default gameSlice.reducer;
