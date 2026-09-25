import type { OppgaveSammendragDto } from 'api/generated/los.schemas';
import { describe, expect, it } from 'vitest';
import { lagOppgaveSammendrag, lagReservasjonMedOppgaver } from '../testdata';
import {
	filtrerOppgaverEtterStatus,
	sorterOppgaverIReservasjon,
	sorterReservasjoner,
} from './reserverteOppgaverSortering';

const oppgave = (
	oppgaveEksternId: string,
	opprettetTidspunkt?: string,
	overstyringer?: Partial<OppgaveSammendragDto>,
) =>
	lagOppgaveSammendrag({
		opprettetTidspunkt,
		oppgaveNøkkel: { områdeEksternId: 'K9', oppgaveTypeEksternId: 'k9sak', oppgaveEksternId },
		...overstyringer,
	});

const reservasjon = (reservasjonsnøkkel: string, reservertTil: string, oppgaver: OppgaveSammendragDto[] = []) =>
	lagReservasjonMedOppgaver({ reservasjonsnøkkel, reservertTil }, oppgaver);

describe('sorterReservasjoner', () => {
	it('sorterer reservasjonen som utløper først øverst', () => {
		const resultat = sorterReservasjoner([
			reservasjon('B', '2026-08-06T23:59:00'),
			reservasjon('A', '2026-08-04T23:59:00'),
		]);
		expect(resultat.map((r) => r.reservasjon.reservasjonsnøkkel)).toEqual(['A', 'B']);
	});

	it('bryter lik utløpstid på reservasjonsnøkkel', () => {
		const resultat = sorterReservasjoner([
			reservasjon('K9_t_PSB', '2026-08-06T23:59:00'),
			reservasjon('K9_p_abc', '2026-08-06T23:59:00'),
		]);
		expect(resultat.map((r) => r.reservasjon.reservasjonsnøkkel)).toEqual(['K9_p_abc', 'K9_t_PSB']);
	});

	it('gir samme rekkefølge uavhengig av rekkefølgen fra API-et', () => {
		const a = reservasjon('A', '2026-08-06T23:59:00');
		const b = reservasjon('B', '2026-08-06T23:59:00');
		expect(sorterReservasjoner([a, b]).map((r) => r.reservasjon.reservasjonsnøkkel)).toEqual(
			sorterReservasjoner([b, a]).map((r) => r.reservasjon.reservasjonsnøkkel),
		);
	});

	it('plasserer ugyldig utløpstid sist', () => {
		const resultat = sorterReservasjoner([
			reservasjon('Ugyldig', 'ikke-en-dato'),
			reservasjon('Gyldig', '2026-08-06T23:59:00'),
		]);
		expect(resultat.map((r) => r.reservasjon.reservasjonsnøkkel)).toEqual(['Gyldig', 'Ugyldig']);
	});

	it('muterer ikke opprinnelig array', () => {
		const original = [reservasjon('B', '2026-08-06T23:59:00'), reservasjon('A', '2026-08-04T23:59:00')];
		sorterReservasjoner(original);
		expect(original.map((r) => r.reservasjon.reservasjonsnøkkel)).toEqual(['B', 'A']);
	});
});

describe('sorterOppgaverIReservasjon', () => {
	it('sorterer eldste oppgave først', () => {
		const resultat = sorterOppgaverIReservasjon([
			oppgave('ny', '2026-06-27T09:00:00'),
			oppgave('gammel', '2026-06-26T09:00:00'),
		]);
		expect(resultat.map((o) => o.oppgaveNøkkel.oppgaveEksternId)).toEqual(['gammel', 'ny']);
	});

	it('bryter likt opprettetTidspunkt på sammensatt oppgavenøkkel', () => {
		const resultat = sorterOppgaverIReservasjon([
			oppgave('b', '2026-06-26T09:00:00'),
			oppgave('a', '2026-06-26T09:00:00'),
		]);
		expect(resultat.map((o) => o.oppgaveNøkkel.oppgaveEksternId)).toEqual(['a', 'b']);
	});

	it('skiller oppgaver med lik ekstern id på område og oppgavetype', () => {
		const resultat = sorterOppgaverIReservasjon([
			oppgave('lik', '2026-06-26T09:00:00', {
				oppgaveNøkkel: { områdeEksternId: 'K9', oppgaveTypeEksternId: 'k9tilbake', oppgaveEksternId: 'lik' },
			}),
			oppgave('lik', '2026-06-26T09:00:00', {
				oppgaveNøkkel: { områdeEksternId: 'K9', oppgaveTypeEksternId: 'k9punsj', oppgaveEksternId: 'lik' },
			}),
		]);
		expect(resultat.map((o) => o.oppgaveNøkkel.oppgaveTypeEksternId)).toEqual(['k9punsj', 'k9tilbake']);
	});

	it('plasserer oppgaver uten opprettetTidspunkt sist', () => {
		const resultat = sorterOppgaverIReservasjon([oppgave('ukjent'), oppgave('kjent', '2026-06-26T09:00:00')]);
		expect(resultat.map((o) => o.oppgaveNøkkel.oppgaveEksternId)).toEqual(['kjent', 'ukjent']);
	});

	it('muterer ikke opprinnelig array', () => {
		const original = [oppgave('ny', '2026-06-27T09:00:00'), oppgave('gammel', '2026-06-26T09:00:00')];
		sorterOppgaverIReservasjon(original);
		expect(original.map((o) => o.oppgaveNøkkel.oppgaveEksternId)).toEqual(['ny', 'gammel']);
	});

	it('holder oppgavene i reservasjonen samlet ved rendring av alle reservasjoner', () => {
		const reservasjoner = [
			reservasjon('B', '2026-08-06T23:59:00', [
				oppgave('b2', '2026-06-27T09:00:00'),
				oppgave('b1', '2026-06-26T09:00:00'),
			]),
			reservasjon('A', '2026-08-06T23:59:00', [oppgave('a1', '2026-06-26T09:00:00')]),
		];

		const rader = sorterReservasjoner(reservasjoner).flatMap((r) =>
			sorterOppgaverIReservasjon(r.oppgaver).map((o) => o.oppgaveNøkkel.oppgaveEksternId),
		);

		expect(rader).toEqual(['a1', 'b1', 'b2']);
	});
});

describe('filtrerOppgaverEtterStatus', () => {
	const oppgaver = [
		oppgave('åpen'),
		oppgave('venter', undefined, { oppgavestatus: { kode: 'VENTER', navn: 'Venter' } }),
		oppgave('lukket', undefined, { oppgavestatus: { kode: 'LUKKET', navn: 'Lukket' } }),
	];

	it('viser bare åpne oppgaver som standard', () => {
		expect(filtrerOppgaverEtterStatus(oppgaver, true, false).map((o) => o.oppgaveNøkkel.oppgaveEksternId)).toEqual([
			'åpen',
		]);
	});

	it('inkluderer oppgaver på vent når dette er valgt', () => {
		expect(filtrerOppgaverEtterStatus(oppgaver, true, true).map((o) => o.oppgaveNøkkel.oppgaveEksternId)).toEqual([
			'åpen',
			'venter',
		]);
	});
});
