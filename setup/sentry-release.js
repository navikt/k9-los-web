import { SentryCli } from '@sentry/cli';

async function opprettReleaseTilSentry() {
	// Samme verdi som frontend-bygget ble kompilert med, slik at source maps matcher releasen.
	const release = process.env.VITE_SENTRY_RELEASE;
	const authToken = process.env.SENTRY_AUTH_TOKEN;

	if (!release) {
		throw new Error('"VITE_SENTRY_RELEASE" er ikke satt – må være samme verdi som ble brukt under bygget');
	}

	if (!authToken) {
		throw new Error('"SENTRY_AUTH_TOKEN" er ikke satt');
	}

	const cli = new SentryCli();

	try {
		console.log(`Oppretter Sentry-release ${release}`);
		await cli.releases.new(release);

		console.log('Laster opp source maps');
		await cli.releases.uploadSourceMaps(release, {
			include: ['dist/public'],
			urlPrefix: '~/public',
			rewrite: false,
		});

		console.log('Releaser');
		await cli.releases.finalize(release);
	} catch (e) {
		console.error('Noe gikk galt under source map-opplasting:', e);
	}
}

opprettReleaseTilSentry();
