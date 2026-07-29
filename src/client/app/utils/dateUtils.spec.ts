import { describe, expect, it } from 'vitest';
import { timeFormat } from './dateUtils';

describe('dateUtils', () => {
	describe('timeFormat', () => {
		it('formaterer en dato til kun klokkeslett', () => {
			const dateTime = '2017-08-02T01:54:25.455';
			expect(timeFormat(dateTime)).toEqual('01:54');
		});
	});
});
