import React from 'react';
import {
  createSlice,
  SliceCaseReducers,
  PayloadAction,
  createSelector
} from '@reduxjs/toolkit';

import { Directions, GameModes, GetOppositeDirection } from '../Shared';
import { RootState } from '../store';

interface GameState {
  gameMode: GameModes;
  isDraggingLCTiles: boolean;
  chosenDirection?: Directions;
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
    clearChosenDirection: (state) => {
      state.chosenDirection = undefined;
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
  clearChosenDirection
} = gameSlice.actions;

export default gameSlice.reducer;
