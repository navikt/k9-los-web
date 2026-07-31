import { describe, expect, it } from 'vitest';
import { removeCredentials } from '../../server/src/proxy-headers.js';

describe('removeCredentials', () => {
	it('fjerner credentials uavhengig av casing', () => {
		const headers = {
			Authorization: 'Bearer user-token',
			Cookie: 'session=secret',
			'Proxy-Authorization': 'Basic secret',
			'X-Forwarded-Access-Token': 'forwarded-token',
			'Content-Type': 'application/json',
		};

		removeCredentials(headers);

		expect(headers).toEqual({ 'Content-Type': 'application/json' });
	});
});
