import dayjs from 'dayjs';
import { Oppgavefelt, TolkesSom, Verdiforklaring } from './filterTsTypes';

/** Reservert verdi for separator-element i UNSAFE_Combobox. */
export const COMBOBOX_SEPARATOR_VALUE = '__separator__';

/**
 * Genererer CSS som gjør separator-opsjonen til en synlig strek.
 * Selve separator-elementet har pointer-events: none så hover-stilen ikke aktiveres.
 */
export const comboboxSeparatorStyle = (containerClass: string): string => `
	.${containerClass} li[id$="-option-${COMBOBOX_SEPARATOR_VALUE}"] {
		margin: 4px 0;
		padding: 0;
		height: 0;
		border-top: 2px solid var(--ax-border-focus);
		border-radius: 0;
		pointer-events: none;
	}
	.${containerClass} li[id$="-option-${COMBOBOX_SEPARATOR_VALUE}"] > * {
		display: none;
	}
`;

export const OPERATORS = {
	// Eksakt lik
	EQUALS: 'EQUALS',
	// Ikke lik
	NOT_EQUALS: 'NOT_EQUALS',
	// Ett av kriteriene i IN må være oppfylt
	IN: 'IN',
	// Eksluderer alle som er i NOT_IN
	NOT_IN: 'NOT_IN',
	// Mindre enn
	LESS_THAN: 'LESS_THAN',
	// Mindre enn eller lik
	LESS_THAN_OR_EQUALS: 'LESS_THAN_OR_EQUALS',
	// Større enn
	GREATER_THAN: 'GREATER_THAN',
	// Større enn eller lik
	GREATER_THAN_OR_EQUALS: 'GREATER_THAN_OR_EQUALS',
	// To verdier og alle som er mellom disse
	INTERVAL: 'INTERVAL',
};

export const operatorsFraTolkesSom = (tolkesSom: string, antallVerdiforklaringer = 0) => {
	switch (tolkesSom) {
		case TolkesSom.String:
			if (antallVerdiforklaringer === 0) {
				return [OPERATORS.EQUALS, OPERATORS.NOT_EQUALS];
			}
			return [OPERATORS.IN, OPERATORS.NOT_IN];
		case TolkesSom.Boolean:
			return [OPERATORS.IN];
		case TolkesSom.Duration:
			return [OPERATORS.LESS_THAN_OR_EQUALS, OPERATORS.GREATER_THAN_OR_EQUALS];
		case TolkesSom.Timestamp:
			return [OPERATORS.LESS_THAN_OR_EQUALS, OPERATORS.GREATER_THAN_OR_EQUALS, OPERATORS.INTERVAL];
		case TolkesSom.Integer:
			return [
				OPERATORS.EQUALS,
				OPERATORS.NOT_EQUALS,
				OPERATORS.LESS_THAN,
				OPERATORS.LESS_THAN_OR_EQUALS,
				OPERATORS.GREATER_THAN,
				OPERATORS.GREATER_THAN_OR_EQUALS,
			];
		default:
			return Object.values(OPERATORS);
	}
};

export const visningsnavnForFelt = (felter: Oppgavefelt[], område: string, kode: string) => {
	const result = felter.find((felt) => felt.område === område && felt.kode === kode);
	if (result !== null) {
		return result.visningsnavn;
	}
	return kode;
};

export const mapBooleanToStringArray = (values: (string | null)[]): string[] =>
	values.map((value) => {
		if (value === 'true') {
			return 'ja';
		}
		if (value === 'false') {
			return 'nei';
		}
		return 'ikkeSatt';
	});

export const mapStringToBooleanArray = (values: string[]): (string | null)[] =>
	values.map((value) => {
		if (value === 'ja') {
			return 'true';
		}
		if (value === 'nei') {
			return 'false';
		}
		return null;
	});

/**
 * Sorterer verdiforklaringer i tre grupper:
 * 1. Pinnet til toppen: rekkefølge >= 0, sortert stigende (0 først). Likt tall → alfabetisk.
 * 2. Uprioriterte: rekkefølge == null, sortert alfabetisk.
 * 3. Pinnet til bunnen: rekkefølge < 0, sortert stigende (-1 betyr sist, -2 nest sist osv.). Likt tall → alfabetisk.
 */
export const sorterVerdiforklaringer = (verdiforklaringer: Verdiforklaring[]): Verdiforklaring[] =>
	[...verdiforklaringer].sort((a, b) => {
		const gruppeFor = (r: number | undefined) => (r == null ? 1 : r < 0 ? 2 : 0);
		const ag = gruppeFor(a.rekkefølge);
		const bg = gruppeFor(b.rekkefølge);
		if (ag !== bg) return ag - bg;
		if (a.rekkefølge != null && b.rekkefølge != null) {
			if (a.rekkefølge !== b.rekkefølge) return a.rekkefølge - b.rekkefølge;
		}
		return a.visningsnavn.localeCompare(b.visningsnavn);
	});

export const calculateDays = (verdi: string[]): number | undefined => {
	if (!verdi || verdi.length === 0) return undefined;

	return verdi.reduce((acc, curr) => {
		if (typeof curr === 'string' && dayjs(curr).isValid()) {
			const days = dayjs.duration(dayjs(curr).diff(dayjs().startOf('day'))).asDays();
			return Number.isNaN(days) ? acc : acc + days;
		}
		const days = dayjs.duration(curr).asDays();
		return Number.isNaN(days) ? acc : acc + days;
	}, 0);
};
