import { configureStore } from '@reduxjs/toolkit';
import letterCloudReducer from './slices/LetterCloudSlice';
import wordGridReducer from './slices/WordGridSlice';
import gameReducer from './slices/GameSlice';
import wordInProgressReducer from './slices/WordInProgressSlice';

const store = configureStore({
  reducer: {
    game: gameReducer,
    letterCloud: letterCloudReducer,
    wordInProgress: wordInProgressReducer,
    wordGrid: wordGridReducer
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
