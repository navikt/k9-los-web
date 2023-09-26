import dayjs from 'dayjs';
import { Oppgavefelt, Oppgaverad, TolkesSom } from './filterTsTypes';

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
};

export function feltverdiKey(item) {
	return `${item.område !== null ? item.område : ''}__${item.kode}`;
}

export const operatorsFraTolkesSom = (tolkesSom: string, antallVerdiforklaringer = 0) => {
	// Boolean -> in
	// Hvis String uten verdiforklaringer -> equals
	// Hvis String med mindre enn 4 verdiforklaringer -> IN
	// Hvis String med 4 eller flere verdiforklaringer -> IN, NOT_IN
	// Timestamp alltid LESS_THAN_OR_EQUALS, GREATER_THAN_OR_EQUALS
	// Duration alltid LESS_THAN_OR_EQUALS, GREATER_THAN_OR_EQUALS
	switch (tolkesSom) {
		case TolkesSom.String:
			if (antallVerdiforklaringer === 0) {
				return [OPERATORS.EQUALS];
			}
			if (antallVerdiforklaringer < 4) {
				return [OPERATORS.IN];
			}
			return [OPERATORS.IN, OPERATORS.NOT_IN];
		case TolkesSom.Boolean:
			return [OPERATORS.IN];
		case TolkesSom.Duration:
		case TolkesSom.Timestamp:
			return [OPERATORS.LESS_THAN_OR_EQUALS, OPERATORS.GREATER_THAN_OR_EQUALS];
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

export function områdeFraKey(key) {
	const område = key.split('__')[0];
	return område.length > 0 ? område : null;
}

export function kodeFraKey(key) {
	return key.split('__')[1];
}

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

export const calculateDays = (verdi: any[]): number | undefined => {
	if (!verdi || verdi.length === 0) return undefined;
	const totalDays = verdi.reduce((acc, curr) => {
		if (typeof curr === 'string' && dayjs(curr).isValid()) {
			const days = dayjs.duration(dayjs(curr).diff(dayjs().startOf('day'))).asDays();
			return Number.isNaN(days) ? acc : acc + days;
		}
		const days = dayjs.duration(curr).asDays();
		return Number.isNaN(days) ? acc : acc + days;
	}, 0);
	return totalDays;
};

export const resultatErKunAntall = (oppgaver: Oppgaverad[]) => {
	if (oppgaver.length === 1) {
		if (oppgaver[0].felter.length === 1 && oppgaver[0].felter[0].kode === 'Antall') {
			return true;
		}
	}
	return false;
};
export const antallTreffOppgaver = (oppgaver: Oppgaverad[]) => {
	if (resultatErKunAntall(oppgaver)) {
		return oppgaver[0].felter[0].verdi as string;
	}

	return String(oppgaver.length);
};
