import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import {
	CombineOppgavefilter,
	EnkelOrderFelt,
	EnkelSelectFelt,
	FeltverdiOppgavefilter,
	FilterType,
	Oppgavefelt,
	OppgaveQuery,
	TolkesSom,
} from './filterTsTypes';
import { OPERATORS } from './utils';

dayjs.extend(durationPlugin);

export interface FilterBeskrivelse {
	feltnavn: string;
	verdier: string[];
	nektelse: boolean;
}

export interface SelectBeskrivelse {
	feltnavn: string;
}

export interface OrderBeskrivelse {
	feltnavn: string;
	økende: boolean;
}

export interface OppgaveQueryBeskrivelse {
	filtere: FilterBeskrivelse[];
	select: SelectBeskrivelse[];
	order: OrderBeskrivelse[];
}

function finnFeltdefinisjon(felter: Oppgavefelt[], område: string, kode: string): Oppgavefelt | undefined {
	return felter.find((f) => f.område === område && f.kode === kode);
}

function hentVisningsnavn(felter: Oppgavefelt[], område: string, kode: string): string {
	const feltdef = finnFeltdefinisjon(felter, område, kode);
	return feltdef?.visningsnavn || `${område || ''}.${kode}`;
}

function formaterDuration(verdi: string): string {
	const duration = dayjs.duration(verdi);
	const dager = Math.floor(duration.asDays());
	const timer = duration.hours() % 24;
	if (dager > 0 && timer > 0) {
		return `${dager}d ${timer}t`;
	}
	if (dager > 0) {
		return `${dager}d`;
	}
	return `${timer}t`;
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

function formaterVerdier(verdier: string[], feltdef: Oppgavefelt | undefined): string[] {
	return verdier.map((v) => formaterVerdi(v, feltdef));
}

function erNektelse(operator: string): boolean {
	return operator === OPERATORS.NOT_EQUALS || operator === OPERATORS.NOT_IN;
}

function beskrivelseForFeltverdiFilter(filter: FeltverdiOppgavefilter, felter: Oppgavefelt[]): FilterBeskrivelse {
	const feltdef = finnFeltdefinisjon(felter, filter.område, filter.kode);
	const feltnavn = hentVisningsnavn(felter, filter.område, filter.kode);
	const verdier = formaterVerdier(filter.verdi || [], feltdef);
	const nektelse = erNektelse(filter.operator);

	return {
		feltnavn,
		verdier,
		nektelse,
	};
}

function isFeltverdiOppgavefilter(filter: FilterType): filter is FeltverdiOppgavefilter {
	return filter.type === 'feltverdi';
}

function isCombineOppgavefilter(filter: FilterType): filter is CombineOppgavefilter {
	return filter.type === 'combine';
}

function traverserFiltere(filtere: FilterType[], felter: Oppgavefelt[]): FilterBeskrivelse[] {
	const beskrivelser: FilterBeskrivelse[] = [];

	for (const filter of filtere) {
		if (isFeltverdiOppgavefilter(filter)) {
			if (filter.verdi && filter.verdi.length > 0) {
				beskrivelser.push(beskrivelseForFeltverdiFilter(filter, felter));
			}
		} else if (isCombineOppgavefilter(filter)) {
			beskrivelser.push(...traverserFiltere(filter.filtere, felter));
		}
	}

	return beskrivelser;
}

function beskrivelseForSelectFelt(selectFelt: EnkelSelectFelt, felter: Oppgavefelt[]): SelectBeskrivelse {
	return {
		feltnavn: hentVisningsnavn(felter, selectFelt.område, selectFelt.kode),
	};
}

function beskrivelseForOrderFelt(orderFelt: EnkelOrderFelt, felter: Oppgavefelt[]): OrderBeskrivelse {
	return {
		feltnavn: hentVisningsnavn(felter, orderFelt.område, orderFelt.kode),
		økende: orderFelt.økende,
	};
}

export function utledQueryBeskrivelse(query: OppgaveQuery, felter: Oppgavefelt[]): OppgaveQueryBeskrivelse {
	const filtere = traverserFiltere(query.filtere || [], felter);

	const select = (query.select || [])
		.filter((s) => s.kode)
		.map((s) => beskrivelseForSelectFelt(s, felter));

	const order = (query.order || [])
		.filter((o) => o.kode)
		.map((o) => beskrivelseForOrderFelt(o, felter));

	return {
		filtere,
		select,
		order,
	};
}

export function utledFilterBeskrivelse(query: OppgaveQuery, felter: Oppgavefelt[]): FilterBeskrivelse[] {
	return traverserFiltere(query.filtere || [], felter);
}

export function utledSelectBeskrivelse(query: OppgaveQuery, felter: Oppgavefelt[]): SelectBeskrivelse[] {
	return (query.select || [])
		.filter((s) => s.kode)
		.map((s) => beskrivelseForSelectFelt(s, felter));
}

export function utledOrderBeskrivelse(query: OppgaveQuery, felter: Oppgavefelt[]): OrderBeskrivelse[] {
	return (query.order || [])
		.filter((o) => o.kode)
		.map((o) => beskrivelseForOrderFelt(o, felter));
}
