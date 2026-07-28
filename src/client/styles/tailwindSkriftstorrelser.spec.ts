import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

/**
 * @navikt/ds-tailwind/v4 registrerer skriftstørrelsene under --font-size-*,
 * men Tailwind 4 genererer text-*-utilities fra --text-*-navnerommet. Uten en
 * mapping finnes ikke text-ax-small, text-ax-medium osv. i det hele tatt –
 * klassene blir stille no-ops i markupen. Vi bygger derfor broen selv i
 * global.css.
 *
 * Denne testen vokter den broen. Legger Aksel til eller fjerner en størrelse,
 * feiler testen i stedet for at vi ender opp med døde utility-klasser.
 * Kan slettes når Aksel bruker --text-* direkte.
 */

const require = createRequire(resolve(process.cwd(), 'package.json'));

const lesTokens = (innhold: string, prefiks: string) =>
	[...innhold.matchAll(new RegExp(`--${prefiks}-(ax-[a-z0-9-]+)\\s*:`, 'g'))].map((treff) => treff[1]).sort();

describe('Aksel-skriftstørrelser i Tailwind', () => {
	const akselCss = readFileSync(require.resolve('@navikt/ds-tailwind/v4'), 'utf8');
	const globalCss = readFileSync(resolve(process.cwd(), 'src/client/styles/global.css'), 'utf8');

	const akselStørrelser = lesTokens(akselCss, 'font-size');
	const våreStørrelser = lesTokens(globalCss, 'text');

	it('Aksel eksponerer fortsatt skriftstørrelser vi må mappe selv', () => {
		expect(akselStørrelser.length).toBeGreaterThan(0);
	});

	it('global.css mapper nøyaktig de skriftstørrelsene Aksel tilbyr', () => {
		expect(våreStørrelser).toEqual(akselStørrelser);
	});

	it('hver mapping peker på tilsvarende Aksel-token', () => {
		akselStørrelser.forEach((størrelse) => {
			expect(globalCss).toContain(`--text-${størrelse}: var(--ax-font-size-${størrelse.replace(/^ax-/, '')});`);
		});
	});
});
