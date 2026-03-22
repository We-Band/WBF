import { NOSCHEDULE } from '@constants/time';

const SCHEDULE_BIT_LENGTH = NOSCHEDULE.length;
const BASE64_URL_CHARSET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const BASE64_URL_BASE = BigInt(BASE64_URL_CHARSET.length);
const RANGE_ENCODING_PREFIX = '~';
const COMPACT_NUMBER_WIDTH = 2;
const COMPACT_NUMBER_BASE = BASE64_URL_CHARSET.length;
const RANGE_CHUNK_WIDTH = COMPACT_NUMBER_WIDTH * 2;
export const USER_SCHEDULE_SEPARATOR = '.';

export const parsePathSegments = (path: string) => {
  const segments = path.split('/'); // ["", "lite", "2025-2-31"]
  return segments;
};

export const parsePathToDate = (path: string) => {
  const segments = path.split('/'); // ["", "lite", "2025-2-31"]

  return segments[2];
};

export const parsePathToUserData = (path: string) => {
  const segments = path.split('/'); // ["", "lite", "2025-2-31", "성진-123123123", "정성진-123123123"]

  return segments.length > 3
    ? segments.slice(3).flatMap((user) => {
        const decodedSegment = decodeURIComponent(user);
        const separatorIndex = decodedSegment.lastIndexOf(
          USER_SCHEDULE_SEPARATOR,
        );

        if (separatorIndex === -1) {
          return [];
        }

        const name = decodedSegment.slice(0, separatorIndex);
        const data = decodedSegment.slice(separatorIndex + 1);

        return [{ name, binaryData: decode(data) }];
      })
    : [];
};

export const sumBinaryStrings = (
  userData: { name: string; binaryData: string }[],
): string => {
  if (userData.length === 0) return '0';

  // 가장 긴 binaryData 길이에 맞춰 앞쪽 0으로 패딩
  const maxLength = Math.max(...userData.map((user) => user.binaryData.length));
  const paddedData = userData.map((user) =>
    user.binaryData.padStart(maxLength, '0'),
  );

  let result = '';

  // 뒤에서부터 자리별로 합산
  for (let i = 0; i < maxLength; i++) {
    let sum = 0;

    for (const binary of paddedData) {
      sum += Number(binary[i]); // 문자 숫자를 더함
    }

    result += sum.toString(); // 자리별 총합을 문자열로 추가
  }

  return result;
};

const normalizeBinaryLength = (binaryStr: string): string => {
  if (binaryStr.length >= SCHEDULE_BIT_LENGTH) {
    return binaryStr.slice(-SCHEDULE_BIT_LENGTH);
  }

  return binaryStr.padStart(SCHEDULE_BIT_LENGTH, '0');
};

const encodeCompactNumber = (value: number): string => {
  const maxValue = COMPACT_NUMBER_BASE ** COMPACT_NUMBER_WIDTH;

  if (value < 0 || value >= maxValue) {
    throw new Error(`Value '${value}' is out of compact-number range`);
  }

  let remaining = value;
  let encoded = '';

  for (let i = 0; i < COMPACT_NUMBER_WIDTH; i++) {
    const charIndex = remaining % COMPACT_NUMBER_BASE;
    encoded = BASE64_URL_CHARSET[charIndex] + encoded;
    remaining = Math.floor(remaining / COMPACT_NUMBER_BASE);
  }

  return encoded;
};

const decodeCompactNumber = (encoded: string): number => {
  if (encoded.length !== COMPACT_NUMBER_WIDTH) {
    throw new Error(`Invalid compact-number length: '${encoded}'`);
  }

  let value = 0;

  for (const char of encoded) {
    const idx = BASE64_URL_CHARSET.indexOf(char);

    if (idx === -1) {
      throw new Error(`Invalid compact-number character: '${char}'`);
    }

    value = value * COMPACT_NUMBER_BASE + idx;
  }

  return value;
};

const encodeBitset = (binaryStr: string): string => {
  if (!/[1]/.test(binaryStr)) return '0';

  let bigIntValue = BigInt('0b' + binaryStr);
  let encoded = '';

  while (bigIntValue > 0n) {
    const remainder = bigIntValue % BASE64_URL_BASE;
    encoded = BASE64_URL_CHARSET[Number(remainder)] + encoded;
    bigIntValue /= BASE64_URL_BASE;
  }

  return encoded || '0';
};

const encodeRanges = (binaryStr: string): string => {
  let payload = '';
  let index = 0;

  while (index < binaryStr.length) {
    if (binaryStr[index] === '1') {
      const start = index;

      while (index < binaryStr.length && binaryStr[index] === '1') {
        index++;
      }

      const length = index - start;
      payload += encodeCompactNumber(start) + encodeCompactNumber(length);
      continue;
    }

    index++;
  }

  return `${RANGE_ENCODING_PREFIX}${payload}`;
};

export const encode = (binaryStr: string): string => {
  if (!/[1]/.test(binaryStr)) {
    return '0';
  }

  const bitsetEncoded = encodeBitset(binaryStr);
  const rangeEncoded = encodeRanges(binaryStr);

  return rangeEncoded.length < bitsetEncoded.length
    ? rangeEncoded
    : bitsetEncoded;
};

const decodeBitset = (encodedStr: string): string => {
  if (encodedStr === '0') {
    return NOSCHEDULE;
  }

  let bigIntValue = BigInt(0);

  for (const char of encodedStr) {
    const idx = BASE64_URL_CHARSET.indexOf(char);

    if (idx === -1) {
      throw new Error(`Invalid character '${char}' in encoded string`);
    }

    bigIntValue = bigIntValue * BASE64_URL_BASE + BigInt(idx);
  }

  return normalizeBinaryLength(bigIntValue.toString(2));
};

const decodeRanges = (encodedStr: string): string => {
  const payload = encodedStr.slice(RANGE_ENCODING_PREFIX.length);

  if (payload.length % RANGE_CHUNK_WIDTH !== 0) {
    throw new Error('Invalid range-encoded payload length');
  }

  const binaryArray = Array.from({ length: SCHEDULE_BIT_LENGTH }, () => '0');

  for (let i = 0; i < payload.length; i += RANGE_CHUNK_WIDTH) {
    const start = decodeCompactNumber(payload.slice(i, i + COMPACT_NUMBER_WIDTH));
    const length = decodeCompactNumber(
      payload.slice(
        i + COMPACT_NUMBER_WIDTH,
        i + COMPACT_NUMBER_WIDTH + COMPACT_NUMBER_WIDTH,
      ),
    );

    if (length <= 0 || start < 0 || start + length > SCHEDULE_BIT_LENGTH) {
      throw new Error('Invalid range segment in encoded schedule');
    }

    for (let idx = start; idx < start + length; idx++) {
      binaryArray[idx] = '1';
    }
  }

  return binaryArray.join('');
};

export const decode = (encodedStr: string): string => {
  if (encodedStr === '0') {
    return NOSCHEDULE;
  }

  if (encodedStr.startsWith(RANGE_ENCODING_PREFIX)) {
    return decodeRanges(encodedStr);
  }

  return decodeBitset(encodedStr);
};
