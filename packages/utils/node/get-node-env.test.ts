import { afterEach, expect, test, vi } from 'vitest';
import { getNodeEnv } from './get-node-env.js';

afterEach(() => {
	vi.unstubAllEnvs();
});

test('Returns configured NODE_ENV', () => {
	vi.stubEnv('NODE_ENV', 'testing');
	expect(getNodeEnv()).toBe('testing');
});
