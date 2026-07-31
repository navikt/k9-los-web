export const removeCredentials = (headers) => {
	const credentialHeaders = new Set([
		'authorization',
		'cookie',
		'proxy-authorization',
		'x-access-token',
		'x-auth-request-access-token',
		'x-forwarded-access-token',
		'x-id-token',
	]);

	for (const header of Object.keys(headers)) {
		if (credentialHeaders.has(header.toLowerCase())) {
			delete headers[header];
		}
	}
};
