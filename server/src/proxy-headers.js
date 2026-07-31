const CREDENTIAL_HEADERS = new Set([
	'authorization',
	'cookie',
	'proxy-authorization',
	'x-access-token',
	'x-auth-request-access-token',
	'x-forwarded-access-token',
	'x-id-token',
]);

export const removeCredentials = (headers) => {
	for (const header of Object.keys(headers)) {
		if (CREDENTIAL_HEADERS.has(header.toLowerCase())) {
			delete headers[header];
		}
	}
};
