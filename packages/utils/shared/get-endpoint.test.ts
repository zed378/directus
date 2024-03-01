import { describe, expect, it } from 'vitest';
import { getEndpoint } from './get-endpoint.js';

describe('getEndpoint', () => {
	it('When a system collection is passed in', () => {
		expect(getEndpoint('directus_users')).toBe('/users');
	});

	it('When a non-system collection is passed in', () => {
		expect(getEndpoint('user_collection')).toBe('/items/user_collection');
	});
});
