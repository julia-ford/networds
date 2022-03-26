import { useAppDispatch, useAppSelector } from '../stuff/hooks';
import { selectWgEmojified } from '../stuff/slices/WordGridSlice';

import './NWHeader.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShareSquare,
  faQuestionCircle,
  faXmark
} from '@fortawesome/free-solid-svg-icons';
import {
  setHappyToastMessage,
  toggleShowHelp
} from '../stuff/slices/GameSlice';
import { ReactNode } from 'react';
import { getRandomWords } from '../stuff/dictionary';

export const NWHeader = () => {
  const wgEmoji = useAppSelector(selectWgEmojified);
  const showHelp = useAppSelector((state) => state.game.showHelp);

  const dispatch = useAppDispatch();

  const onCopyEmojiClicked = () => {
    navigator.clipboard.writeText(wgEmoji).then(() => {
      dispatch(setHappyToastMessage('Game results copied!'));
    });
  };
  const alertEmojiButton = (
    <div className='NWHeaderButton Clickable'>
      <FontAwesomeIcon
        onClick={onCopyEmojiClicked}
        icon={faShareSquare}
      ></FontAwesomeIcon>
    </div>
  );

  const onHelpButtonClicked = () => {
    dispatch(toggleShowHelp(undefined));
  };
  const helpButton = (
    <div className='NWHeaderButton Clickable'>
      <FontAwesomeIcon
        icon={faQuestionCircle}
        onClick={onHelpButtonClicked}
      ></FontAwesomeIcon>
    </div>
  );

  const helpPopover = !showHelp ? null : (
    <div className='HelpPopover'>
      <FontAwesomeIcon
        icon={faXmark}
        className='HelpPopoverX Clickable'
        onClick={onHelpButtonClicked}
      ></FontAwesomeIcon>
      <p>
        Make words by clicking and dragging on the letters in the letter cloud
        at the bottom of the screen. On desktop, you can see words you've found
        on the right side of the screen. On mobile, you have to switch between
        word-finding and word-placing mode using the button at the bottom-right
        of the screen.
      </p>
      <p>
        Once you've found some words, you can place them on the board by
        clicking a letter in a word you want to place from your word list, then
        clicking a space on the board you want that letter to go, then picking a
        direction to point the word, then confirming your selections with the
        green check mark button. Your first word can be placed anywhere; all
        subsequent words must connect to a previous word.
      </p>
      <p>
        Placed words will still be listed in your word list, but they'll be
        grayed out. You can remove the most recently placed word by clicking the
        red x button next to the word in the word list.
      </p>
      <p>
        Your goal is to connect the two colored symbols on the board to each
        other by building a bridge of connected words between them, ideally with
        6 words or less.
      </p>
      <p>
        This game is still in development and very much not finished. All
        feedback is welcome. Especially if you find missing words; the
        dictionary I used definitely had some gaps.
      </p>
      <p>Today's random words were {getRandomWords().join(', ')}.</p>
    </div>
  );

  return (
    <div className='NWHeader'>
      <p>Networds</p>
      <div className='NWHeaderButtonRow'>
        {helpButton}
        {alertEmojiButton}
      </div>
      {helpPopover}
    </div>
  );
};
