import { type Knex } from 'knex';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { getUserCount } from './get-user-count.js';

let mockResult: { admin_access: number; app_access: number; count: string }[];
let mockDb: Knex;

beforeEach(() => {
	mockResult = [
		{
			admin_access: 1,
			app_access: 1,
			count: '15',
		},
		{
			admin_access: 0,
			app_access: 1,
			count: '20',
		},
		{
			admin_access: 0,
			app_access: 0,
			count: '25',
		},
	];

	mockDb = {
		count: vi.fn().mockReturnThis(),
		select: vi.fn().mockReturnThis(),
		from: vi.fn().mockReturnThis(),
		leftJoin: vi.fn().mockReturnThis(),
		groupBy: vi.fn().mockResolvedValue(mockResult),
	} as unknown as Knex;
});

afterEach(() => {
	vi.clearAllMocks();
});

test('Fetches counts from the database', async () => {
	await getUserCount(mockDb);

	expect(mockDb.count).toHaveBeenCalledWith('directus_users.id', { as: 'count' });
	expect(mockDb.select).toHaveBeenCalledWith('directus_roles.admin_access', 'directus_roles.app_access');
	expect(mockDb.from).toHaveBeenCalledWith('directus_users');
	expect(mockDb.leftJoin).toHaveBeenCalledWith('directus_roles', 'directus_users.role', '=', 'directus_roles.id');
	expect(mockDb.groupBy).toHaveBeenCalledWith('directus_roles.admin_access', 'directus_roles.app_access');
});

test('Sets final counts based on combination of admin/app access', async () => {
	const res = await getUserCount(mockDb);

	expect(res).toEqual({
		admin: 15,
		app: 20,
		api: 25,
	});
});
