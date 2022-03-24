import { ReactNode } from 'react';
import { useAppSelector } from '../stuff/hooks';
import { selectGameMode } from '../stuff/slices/GameSlice';
import {
  selectAcceptedAsStringCaps,
  selectRejectedAsStringCaps,
  selectWipAsStringCaps
} from '../stuff/slices/WordInProgressSlice';

import './WordInProgress.css';

const noop = () => {
  return false;
};

export const filterLoggingInTests = (
  conditionFilter: (message: string) => boolean = noop,
  method: keyof Console = 'log'
) => {
  // @ts-ignore
  const originalConsoleLog = console[method].bind(console);

  beforeEach(function () {
    // @ts-ignore
    jest.spyOn(console, method).mockImplementation((...args) => {
      const [message = ''] = args;
      const shouldSilence = conditionFilter(message);
      if (shouldSilence) {
        return;
      }

      originalConsoleLog(...args);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
};

export const WordInProgress = () => {
  const gameMode = useAppSelector(selectGameMode);
  const wipString = useAppSelector(selectWipAsStringCaps);
  const rejectedString = useAppSelector(selectRejectedAsStringCaps);
  const acceptedString = useAppSelector(selectAcceptedAsStringCaps);

  const useRejected = wipString.length === 0 && !!rejectedString;
  const useAccepted =
    wipString.length === 0 && !!acceptedString && !useRejected;

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
  const acceptedClass = useAccepted ? 'Accepted' : '';

  return (
    <div
      className={`WordInProgress ${gameMode} ${rejectedClass} ${emptyClass}`}
    >
      {content}
    </div>
  );
};
