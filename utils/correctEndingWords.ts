/**
 * Получить слово с правильным окончанием, в зависимости от числа.
 * @param count Число, для которого нужно слово.
 * @param zero Написание слова для count = 0.
 * @param one Написание слова для count = 1.
 * @param two Написание слова для count = 2.
 * @example
 * getWordWithCorrectEnding(count, 'дней', 'день', 'дня')
 */
export const getWordWithCorrectEnding = (
  count: number,
  zero: string,
  one: string,
  two: string,
) => {
  const stringCount = count.toString();

  if (count > 9 && stringCount[stringCount.length - 2] === '1') {
    return zero;
  }

  if (stringCount.endsWith('1')) {
    return one;
  }

  if (stringCount[stringCount.length - 1].match(/2|3|4/)) {
    return two;
  }

  return zero;
};

type Value = [string, string, string];
type BuilderParam = Record<string, Value>;

/**
 * Генерирует константу с функциями, для получения слова с правильным окончанием в зависимости от переданного числа.
 * @param Объект значения которого это кортежи с написанием слова для чисел 0, 1 и 2.
 * @example
 *  const CORRECT_ENDING_WORD = buildCorrectEndingWords({
      DAYS: ['дней', 'день', 'дня'],
      CARDS: ['карточек', 'карточка', 'карточки'],
    });
 */
export const buildCorrectEndingWords = <
  Obj extends BuilderParam,
  Key extends keyof Obj,
>(
  wordsObj: Obj,
) => {
  const keys = Object.keys(wordsObj) as Key[];
  const result = {} as Record<Key, (count: number) => string>;

  keys.forEach((key) => {
    const args = wordsObj[key] as Value;
    result[key] = (count: number) => getWordWithCorrectEnding(count, ...args);
  });

  return Object.freeze(result);
};
