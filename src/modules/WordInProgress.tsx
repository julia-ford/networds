import { ReactNode } from 'react';
import { useAppSelector } from '../stuff/hooks';
import { selectGameMode } from '../stuff/slices/GameSlice';
import {
  selectAcceptedAsStringCaps,
  selectRejectedAsStringCaps,
  selectWipAsStringCaps
} from '../stuff/slices/WordInProgressSlice';

import './WordInProgress.css';

export const WordInProgress = () => {
  const gameMode = useAppSelector(selectGameMode);
  const wipString = useAppSelector(selectWipAsStringCaps);
  const rejectedString = useAppSelector(selectRejectedAsStringCaps);
  const acceptedString = useAppSelector(selectAcceptedAsStringCaps);

  const useRejected = wipString.length === 0 && !!rejectedString;
  const useAccepted = wipString.length === 0 && !!acceptedString;

  let content = '';
  if (wipString.length > 0) {
    content = wipString;
  } else if (useRejected) {
    content = rejectedString;
  } else if (useAccepted) {
    content = acceptedString;
  }

  const rejectedClass = useRejected ? 'Rejected' : '';
  const emptyClass = wipString.length === 0 && !useRejected ? 'Empty' : '';

  return (
    <div
      className={`WordInProgress ${gameMode} ${rejectedClass} ${emptyClass}`}
    >
      {content}
    </div>
  );
};
