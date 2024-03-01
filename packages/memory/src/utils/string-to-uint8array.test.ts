import { stringToUint8Array } from './string-to-uint8array.js';
import { test, expect } from 'vitest';

test('Converts string to uint8array', () => {
	const string = 'hello';
	const uint8Array = new Uint8Array([104, 101, 108, 108, 111]);

	expect(stringToUint8Array(string)).toEqual(uint8Array);
});
