import { configureStore } from '@reduxjs/toolkit';
import letterCloudReducer from './slices/LetterCloudSlice';
import wordGridReducer from './slices/WordGridSlice';
import gameReducer from './slices/GameSlice';
import wordInProgressReducer from './slices/WordInProgressSlice';
import foundWordsReducer from './slices/FoundWordsSlice';
import stylingReducer from './slices/StylingSlice';

const store = configureStore({
  reducer: {
    game: gameReducer,
    letterCloud: letterCloudReducer,
    wordInProgress: wordInProgressReducer,
    wordGrid: wordGridReducer,
    foundWords: foundWordsReducer,
    styling: stylingReducer
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
