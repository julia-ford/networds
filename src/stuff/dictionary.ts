import dictData from './dict_culled_with_q.json';

const { dictionary } = dictData;

export const SEED_DATE = new Date();
const SEED_STRING = `${SEED_DATE.getUTCFullYear()}${SEED_DATE.getUTCMonth()}${SEED_DATE.getUTCDate()}`;

const xmur3 = (str: string) => {
  let hash = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    hash = Math.imul(hash ^ str.charCodeAt(i), 3432918353);
    hash = (hash << 13) | (hash >>> 19);
  }
  return () => {
    hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
    hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
    return (hash ^= hash >>> 16) >>> 0;
  };
};

const sfc32 = (a: number, b: number, c: number, d: number) => {
  return () => {
    a >>>= 0;
    b >>>= 0;
    c >>>= 0;
    d >>>= 0;
    let t = (a + b) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    d = (d + 1) | 0;
    t = (t + d) | 0;
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
};

const lettersToGrid = (letters: string[]) => {
  return [
    [, letters[0], letters[1], letters[2]],
    [letters[3], letters[4], letters[5], letters[6]],
    [letters[7], letters[8], letters[9], letters[10], letters[11]],
    [letters[12], letters[13], letters[14], letters[15]],
    [, letters[16], letters[17], letters[18]]
  ];
};

const seedFunc = xmur3(SEED_STRING);
const getRand = sfc32(seedFunc(), seedFunc(), seedFunc(), seedFunc());
const randomWords = [
  dictionary[3][Math.trunc(getRand() * dictionary[3].length)],
  dictionary[5][Math.trunc(getRand() * dictionary[5].length)],
  dictionary[5][Math.trunc(getRand() * dictionary[5].length)],
  dictionary[6][Math.trunc(getRand() * dictionary[6].length)]
];

export const getRandomWords = () => {
  return [...randomWords];
};

export const getRandomLetters = () => {
  const stringsSmushed = randomWords.join('');

  const weightedLetters: { letter: string; weight: number }[] = [];
  for (let i = 0; i < stringsSmushed.length; i++) {
    if (stringsSmushed.charAt(i) === 'q') {
      weightedLetters.push({ letter: 'Qu', weight: getRand() });
      i++;
    } else {
      weightedLetters.push({
        letter: stringsSmushed[i].toUpperCase(),
        weight: getRand()
      });
    }
  }

  weightedLetters.sort((a, b) => a.weight - b.weight);

  return lettersToGrid(weightedLetters.map((value) => value.letter));
};

export const dictContains = (rawWord: string) => {
  // Just in case, doing this everywhere I handle words.
  const word = rawWord.toLowerCase();
  // 'Qu' is treated as a single letter.
  // Dictionary does not contain any words with multiple Qs or Qs not
  // followed by a U.
  const length = word.includes('q') ? word.length - 1 : word.length;
  return dictionary[length].includes(word);
};
