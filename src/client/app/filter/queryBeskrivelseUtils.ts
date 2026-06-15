import dayjs from 'dayjs';
import 'utils/dateUtils';
import {
	AGGREGERT_FUNKSJON_VISNINGSNAVN,
	CombineOppgavefilter,
	FeltverdiOppgavefilter,
	OppgaveQuery,
	Oppgavefelt,
	Oppgavefilter,
	OppgavefilterKode,
	OrderFelt,
	SelectFelt,
	TolkesSom,
} from './filterTsTypes';
import { OPERATORS } from './utils';

export interface FilterBeskrivelseSammenføyning {
	prefiks?: string;
	separator?: string;
}

export interface FilterBeskrivelse {
	feltnavn: string;
	verdier: string[];
	sammenføyning: FilterBeskrivelseSammenføyning;
}

export interface SelectBeskrivelse {
	feltnavn: string;
}

export interface OrderBeskrivelse {
	feltnavn: string;
	økende: boolean;
}

function finnFeltdefinisjon(felter: Oppgavefelt[], område: string, kode: string): Oppgavefelt | undefined {
	return felter.find((f) => f.område === område && f.kode === kode);
}

function hentVisningsnavn(felter: Oppgavefelt[], område: string, kode: string): string {
	const feltdefinisjon = finnFeltdefinisjon(felter, område, kode);
	return feltdefinisjon?.visningsnavn ?? kode;
}

function formaterDuration(verdi: string): string {
	const duration = dayjs.duration(verdi);
	return `${Math.floor(duration.asDays())}`;
}

function formaterTimestamp(verdi: string): string {
	const dato = dayjs(verdi);
	if (dato.isValid()) {
		return dato.format('DD.MM.YYYY');
	}
	return verdi;
}

function formaterVerdi(verdi: string, feltdef: Oppgavefelt | undefined): string {
	if (!feltdef) {
		return verdi;
	}

	if (feltdef.verdiforklaringer && feltdef.verdiforklaringer.length > 0) {
		const forklaring = feltdef.verdiforklaringer.find((v) => v.verdi === verdi);
		if (forklaring) {
			return forklaring.visningsnavn;
		}
	}

	if (feltdef.tolkes_som === TolkesSom.Boolean) {
		return verdi === 'true' ? 'Ja' : 'Nei';
	}

	if (feltdef.tolkes_som === TolkesSom.Duration) {
		return formaterDuration(verdi);
	}

	if (feltdef.tolkes_som === TolkesSom.Timestamp) {
		return formaterTimestamp(verdi);
	}

	return verdi;
}

function formaterVerdier(verdier: string[], feltdefinisjon: Oppgavefelt | undefined): string[] {
	if (verdier.length >= 10) {
		return [`${verdier.length} kriterier`];
	}
	return verdier.map((v) => formaterVerdi(v, feltdefinisjon));
}

function bestemSammenføyning(tolkesSom: TolkesSom | undefined, operator: string): FilterBeskrivelseSammenføyning {
	if (operator === 'OR') {
		return { separator: ' eller ' };
	}
	if (operator === 'AND') {
		return { separator: ' og ' };
	}
	if (operator === OPERATORS.NOT_EQUALS || operator === OPERATORS.NOT_IN) {
		return { prefiks: 'ikke ', separator: ', ' };
	}
	if (operator === OPERATORS.LESS_THAN_OR_EQUALS && tolkesSom === TolkesSom.Timestamp) {
		return { prefiks: 't.o.m. ' };
	}
	if (operator === OPERATORS.LESS_THAN_OR_EQUALS && tolkesSom !== TolkesSom.Timestamp) {
		return { prefiks: '<= ' };
	}
	if (operator === OPERATORS.LESS_THAN) {
		return { prefiks: '< ' };
	}
	if (operator === OPERATORS.GREATER_THAN_OR_EQUALS && tolkesSom === TolkesSom.Timestamp) {
		return { prefiks: 'f.o.m. ' };
	}
	if (operator === OPERATORS.GREATER_THAN_OR_EQUALS && tolkesSom !== TolkesSom.Timestamp) {
		return { prefiks: '>= ' };
	}
	if (operator === OPERATORS.GREATER_THAN) {
		return { prefiks: '> ' };
	}
	if (operator === OPERATORS.INTERVAL) {
		return { separator: ' – ' };
	}
	return { separator: ', ' };
}

function beskrivelseForFeltverdiFilter(filter: FeltverdiOppgavefilter, felter: Oppgavefelt[]): FilterBeskrivelse {
	const feltdefinisjon = finnFeltdefinisjon(felter, filter.område, filter.kode);
	const feltnavn = hentVisningsnavn(felter, filter.område, filter.kode);
	const verdier = formaterVerdier(filter.verdi, feltdefinisjon);
	const sammenføyning = bestemSammenføyning(feltdefinisjon?.tolkes_som, filter.operator);

	return {
		feltnavn,
		verdier,
		sammenføyning,
	};
}

function beskrivelseForCombineFilter(filter: CombineOppgavefilter, felter: Oppgavefelt[]): FilterBeskrivelse {
	const feltnavn = 'Gruppe';
	// eslint-disable-next-line @typescript-eslint/no-use-before-define -- gjensidig rekursjon mellom hoistede funksjoner
	const verdier = traverserFiltere(filter.filtere, felter).map(({ feltnavn: f }) => f);
	const prefiks = bestemSammenføyning(undefined, filter.combineOperator);

	return {
		feltnavn,
		verdier,
		sammenføyning: prefiks,
	};
}

function isFeltverdiOppgavefilter(filter: Oppgavefilter): filter is FeltverdiOppgavefilter {
	return filter.type === 'feltverdi';
}

function isCombineOppgavefilter(filter: Oppgavefilter): filter is CombineOppgavefilter {
	return filter.type === 'combine';
}

function traverserFiltere(filtere: Oppgavefilter[], felter: Oppgavefelt[]): FilterBeskrivelse[] {
	const beskrivelser: FilterBeskrivelse[] = [];

	for (const filter of filtere) {
		if (isFeltverdiOppgavefilter(filter)) {
			if (filter.verdi && filter.verdi.length > 0) {
				beskrivelser.push(beskrivelseForFeltverdiFilter(filter, felter));
			}
		} else if (isCombineOppgavefilter(filter)) {
			beskrivelser.push(beskrivelseForCombineFilter(filter, felter));
		}
	}

	return beskrivelser;
}

function beskrivelseForSelectFelt(selectFelt: SelectFelt, felter: Oppgavefelt[]): SelectBeskrivelse {
	if (selectFelt.type === 'aggregert') {
		const funksjonNavn = AGGREGERT_FUNKSJON_VISNINGSNAVN[selectFelt.funksjon];
		if (selectFelt.område && selectFelt.kode) {
			return { feltnavn: `${funksjonNavn}(${hentVisningsnavn(felter, selectFelt.område, selectFelt.kode)})` };
		}
		return { feltnavn: funksjonNavn };
	}
	return {
		feltnavn: hentVisningsnavn(felter, selectFelt.område, selectFelt.kode),
	};
}

function beskrivelseForOrderFelt(orderFelt: OrderFelt, felter: Oppgavefelt[]): OrderBeskrivelse {
	if (orderFelt.type === 'aggregert') {
		const funksjonNavn = AGGREGERT_FUNKSJON_VISNINGSNAVN[orderFelt.funksjon];
		if (orderFelt.område && orderFelt.kode) {
			return {
				feltnavn: `${funksjonNavn}(${hentVisningsnavn(felter, orderFelt.område, orderFelt.kode)})`,
				økende: orderFelt.økende,
			};
		}
		return { feltnavn: funksjonNavn, økende: orderFelt.økende };
	}
	return {
		feltnavn: hentVisningsnavn(felter, orderFelt.område, orderFelt.kode),
		økende: orderFelt.økende,
	};
}

export function utledFilterBeskrivelse(query: OppgaveQuery, felter: Oppgavefelt[]): FilterBeskrivelse[] {
	return traverserFiltere(query.filtere, felter);
}

// Standardverdier som regnes som "default" og derfor kan skjules i en forenklet visning.
const STANDARD_OPPGAVESTATUS = ['AAPEN'];
const STANDARD_PERSONBESKYTTELSE = ['UGRADERT'];

function harSammeVerdier(a: string[], b: string[]): boolean {
	if (a.length !== b.length) {
		return false;
	}
	return a.every((v) => b.includes(v));
}

function erStandardverdiFilter(filter: FeltverdiOppgavefilter): boolean {
	if (filter.operator !== OPERATORS.IN && filter.operator !== OPERATORS.EQUALS) {
		return false;
	}
	if (filter.kode === OppgavefilterKode.Oppgavestatus) {
		return harSammeVerdier(filter.verdi, STANDARD_OPPGAVESTATUS);
	}
	if (filter.kode === OppgavefilterKode.Personbeskyttelse) {
		return harSammeVerdier(filter.verdi, STANDARD_PERSONBESKYTTELSE);
	}
	return false;
}

/**
 * Som utledFilterBeskrivelse, men skjuler kriterier som kun har standardverdier
 * (Oppgavestatus = Åpen, Personbeskyttelse = Ikke kode 7 eller egen ansatt).
 * Brukes i forenklet visning for saksbehandler; lagrede søk skal fortsatt vise alle kriterier.
 */
export function utledFilterBeskrivelseUtenStandardverdier(
	query: OppgaveQuery,
	felter: Oppgavefelt[],
): FilterBeskrivelse[] {
	const filtrerteFiltere = query.filtere.filter(
		(filter) => !(isFeltverdiOppgavefilter(filter) && erStandardverdiFilter(filter)),
	);
	return traverserFiltere(filtrerteFiltere, felter);
}

export function utledSelectBeskrivelse(query: OppgaveQuery, felter: Oppgavefelt[]): SelectBeskrivelse[] {
	return query.select.filter((s) => s.type === 'aggregert' || s.kode).map((s) => beskrivelseForSelectFelt(s, felter));
}

export function utledOrderBeskrivelse(query: OppgaveQuery, felter: Oppgavefelt[]): OrderBeskrivelse[] {
	return query.order.filter((o) => o.type === 'aggregert' || o.kode).map((o) => beskrivelseForOrderFelt(o, felter));
}
