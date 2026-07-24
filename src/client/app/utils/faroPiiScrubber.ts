import type { TransportItem } from '@grafana/faro-web-sdk';

/**
 * PII-scrubbing for Faro/Nais APM.
 *
 * Faro sender console-output, exceptions og URL-er til Nais APM (Loki). Disse kan
 * inneholde fødselsnummer, D-nummer eller tokens. Nais anbefaler eksplisitt en
 * `beforeSend`-hook som vasker bort slike verdier før de forlater nettleseren.
 *
 * Vi redigerer bort:
 *  - Fødselsnummer / D-nummer: 11 sammenhengende sifre
 *  - JWT-er: eyJ...-formatet
 *  - Bearer-tokens: "Bearer <verdi>"
 *
 * Rekkefølgen er bevisst: JWT og Bearer først, deretter 11-sifret fnr – slik at
 * tall inne i et allerede-redigert token ikke dobbeltbehandles.
 */

const JWT = /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g;
const BEARER = /Bearer\s+[A-Za-z0-9._-]+/gi;
const FNR = /\b\d{11}\b/g;

export function scrubString(value: string): string {
	return value
		.replace(JWT, '[redacted-token]')
		.replace(BEARER, 'Bearer [redacted-token]')
		.replace(FNR, '[redacted-fnr]');
}

function scrubDeep(value: unknown): unknown {
	if (typeof value === 'string') {
		return scrubString(value);
	}
	if (Array.isArray(value)) {
		return value.map(scrubDeep);
	}
	if (value !== null && typeof value === 'object') {
		const record = value as Record<string, unknown>;
		Object.keys(record).forEach((key) => {
			record[key] = scrubDeep(record[key]);
		});
		return record;
	}
	return value;
}

/**
 * `beforeSend`-hook for `initializeFaro`. Vasker både payload (log-/exception-
 * meldinger og kontekst) og meta (bl.a. `page.url` som kan ha fnr i query-param).
 */
export function faroBeforeSend(item: TransportItem): TransportItem {
	scrubDeep(item.payload);
	scrubDeep(item.meta);
	return item;
}
