import { _cache, useEnv } from './use-env.js';
import { test, expect, vi, afterEach } from 'vitest';
import { createEnv } from './create-env.js';

vi.mock('./create-env.js');

afterEach(() => {
	vi.resetAllMocks();

	_cache.env = undefined;
});

test('Returns cached env if exists', () => {
	_cache.env = {};

	const env = useEnv();

	expect(env).toBe(_cache.env);
});

test('Creates new cached env if not exists', () => {
	const mockEnv = {};
	vi.mocked(createEnv).mockReturnValue(mockEnv);

	const env = useEnv();

	expect(env).toBe(mockEnv);
	expect(_cache.env).toBe(mockEnv);
});
