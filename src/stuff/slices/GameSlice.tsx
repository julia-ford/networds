import React from 'react';
import {
  createSlice,
  SliceCaseReducers,
  PayloadAction
} from '@reduxjs/toolkit';

import { Directions, GameModes } from '../Shared';
import { RootState } from '../store';

interface GameState {
  gameMode: GameModes;
  chosenDirection?: Directions;
}
const gameSlice = createSlice<GameState, SliceCaseReducers<GameState>>({
  name: 'letterCloud',
  initialState: {
    gameMode: GameModes.BuildingWord
  },
  reducers: {
    setGameMode: (state, action: PayloadAction<GameModes>) => {
      state.gameMode = action.payload;
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

export const { setGameMode, setChosenDirection, clearChosenDirection } =
  gameSlice.actions;

export default gameSlice.reducer;
