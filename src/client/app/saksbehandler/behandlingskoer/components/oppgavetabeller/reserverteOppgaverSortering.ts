import type ReservasjonV3 from 'saksbehandler/behandlingskoer/ReservasjonV3Dto';
import type { OppgaveNøkkel } from 'types/OppgaveNøkkel';
import type OppgaveV3 from 'types/OppgaveV3';
import { OppgavestatusV3 } from 'types/OppgaveV3';

/**
 * Tidspunkt som ikke lar seg tolke sorteres sist, slik at rekkefølgen forblir
 * forutsigbar selv om backend sender manglende eller ugyldige verdier.
 */
const tidspunkt = (verdi: string | undefined): number => {
	const millisekunder = verdi ? new Date(verdi).getTime() : Number.NaN;
	return Number.isNaN(millisekunder) ? Number.POSITIVE_INFINITY : millisekunder;
};

const dato = (verdi: string | undefined): string | undefined => {
	if (!verdi) return undefined;
	return verdi.split('T')[0];
};

/**
 * Sammensatt oppgavenøkkel gir en stabil identitet når tidspunktene er like.
 * Samme identitet brukes som React-nøkkel og for å gjenkjenne rader som flyttes.
 */
export const nøkkelStreng = (nøkkel: OppgaveNøkkel): string =>
	`${nøkkel.områdeEksternId}|${nøkkel.oppgaveTypeEksternId}|${nøkkel.oppgaveEksternId}`;

/**
 * Sorterer oppgavene innenfor én reservasjon. Alle oppgavene deler
 * reservasjonsnøkkel, så de holdes samlet uansett rekkefølge.
 */
export const sorterOppgaverIReservasjon = (oppgaver: OppgaveV3[]): OppgaveV3[] =>
	oppgaver.toSorted(
		(a, b) =>
			tidspunkt(a.opprettetTidspunkt) - tidspunkt(b.opprettetTidspunkt) ||
			nøkkelStreng(a.oppgaveNøkkel).localeCompare(nøkkelStreng(b.oppgaveNøkkel)),
	);

export const filtrerOppgaverEtterStatus = (oppgaver: OppgaveV3[], visOppgaverPåVent: boolean): OppgaveV3[] =>
	oppgaver.filter(
		(oppgave) =>
			oppgave.oppgavestatus === OppgavestatusV3.AAPEN ||
			(visOppgaverPåVent && oppgave.oppgavestatus === OppgavestatusV3.VENTER),
	);

/**
 * Sorterer reservasjonene med den som utløper først øverst. Lik utløpstid brytes
 * på reservasjonsnøkkel, slik at rekkefølgen ikke avhenger av API-rekkefølgen.
 */
export const sorterReservasjoner = (reservasjoner: ReservasjonV3[]): ReservasjonV3[] =>
	reservasjoner.toSorted(
		(a, b) =>
			dato(a.reservertTil)?.localeCompare(dato(b.reservertTil) ?? '') ||
			a.reservasjonsnøkkel.localeCompare(b.reservasjonsnøkkel),
	);
