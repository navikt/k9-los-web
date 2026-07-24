import type { TransportItem } from '@grafana/faro-web-sdk';
import { faroBeforeSend, scrubString } from './faroPiiScrubber';

describe('scrubString', () => {
	it('redigerer bort fødselsnummer (11 sifre)', () => {
		expect(scrubString('Bruker 12345678901 feilet')).toBe('Bruker [redacted-fnr] feilet');
	});

	it('lar tall som ikke er 11 sifre være i fred', () => {
		expect(scrubString('ordre 1234567 og 123456789012345')).toBe('ordre 1234567 og 123456789012345');
	});

	it('redigerer bort JWT-tokens', () => {
		const jwt = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwMSJ9.abc-DEF_123';
		expect(scrubString(`Authorization brukte ${jwt}`)).toBe('Authorization brukte [redacted-token]');
	});

	it('redigerer bort Bearer-tokens (ikke-JWT)', () => {
		expect(scrubString('header: Bearer abc123.def-456')).toBe('header: Bearer [redacted-token]');
	});

	it('håndterer flere treff i samme streng', () => {
		expect(scrubString('12345678901 og 98765432109')).toBe('[redacted-fnr] og [redacted-fnr]');
	});
});

describe('faroBeforeSend', () => {
	it('vasker log-melding og kontekst', () => {
		const item = {
			type: 'log',
			payload: {
				message: 'Feil for 12345678901',
				context: { url: 'https://los.nav.no/sak?fnr=98765432109' },
			},
			meta: { page: { url: 'https://los.nav.no/sak?fnr=11111111111' } },
		} as unknown as TransportItem;

		const result = faroBeforeSend(item);

		expect((result.payload as { message: string }).message).toBe('Feil for [redacted-fnr]');
		expect((result.payload as { context: { url: string } }).context.url).toBe(
			'https://los.nav.no/sak?fnr=[redacted-fnr]',
		);
		expect((result.meta.page as { url: string }).url).toBe('https://los.nav.no/sak?fnr=[redacted-fnr]');
	});

	it('returnerer item slik at eventet fortsatt sendes', () => {
		const item = { type: 'log', payload: { message: 'ok' }, meta: {} } as unknown as TransportItem;
		expect(faroBeforeSend(item)).toBe(item);
	});
});
