import type { ArrayFn, ExtractFn } from '@directus/data';
import type { ValuesNode } from '../../parameterized-statement.js';

export interface AbstractSqlQueryFnNode {
	type: 'fn';

	tableIndex: number;
	columnName: string;

	/**
	 * A list of supported functions. Those are the same as the abstract query.
	 */
	fn: ExtractFn | ArrayFn;

	/*
	 * Used to specify additional arguments.
	 * Same as will all user input, the arguments are passed via parameters.
	 */
	arguments?: ValuesNode;

	/**
	 * Used to specify a path to a nested value.
	 */
	path?: string[];
}
