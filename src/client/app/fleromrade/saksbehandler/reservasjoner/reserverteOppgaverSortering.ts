import type { OppgaveNokkelDto, OppgaveSammendragDto, ReservasjonMedOppgaverDto } from 'api/generated/los.schemas';

// Samme regler som legacy-visningen på feature/reservasjon-sortering, på de genererte typene.

/**
 * Tidspunkt som ikke lar seg tolke sorteres sist, slik at rekkefølgen forblir
 * forutsigbar selv om backend sender manglende eller ugyldige verdier.
 */
const tidspunkt = (verdi: string | null | undefined): number => {
	const millisekunder = verdi ? new Date(verdi).getTime() : Number.NaN;
	return Number.isNaN(millisekunder) ? Number.POSITIVE_INFINITY : millisekunder;
};

const dato = (verdi: string | null | undefined): string | undefined => {
	if (!verdi) return undefined;
	return verdi.split('T')[0];
};

/**
 * Sammensatt oppgavenøkkel gir en stabil identitet når tidspunktene er like.
 * Samme identitet brukes som React-nøkkel og for å gjenkjenne rader som flyttes.
 */
export const nøkkelStreng = (nøkkel: OppgaveNokkelDto): string =>
	`${nøkkel.områdeEksternId}|${nøkkel.oppgaveTypeEksternId}|${nøkkel.oppgaveEksternId}`;

/**
 * Sorterer oppgavene innenfor én reservasjon. Alle oppgavene deler
 * reservasjonsnøkkel, så de holdes samlet uansett rekkefølge.
 */
export const sorterOppgaverIReservasjon = (oppgaver: OppgaveSammendragDto[]): OppgaveSammendragDto[] =>
	oppgaver.toSorted(
		(a, b) =>
			tidspunkt(a.opprettetTidspunkt) - tidspunkt(b.opprettetTidspunkt) ||
			nøkkelStreng(a.oppgaveNøkkel).localeCompare(nøkkelStreng(b.oppgaveNøkkel)),
	);

export const filtrerOppgaverEtterStatus = (
	oppgaver: OppgaveSammendragDto[],
	visÅpne: boolean,
	visPåVent: boolean,
): OppgaveSammendragDto[] =>
	oppgaver.filter(
		({ oppgavestatus }) =>
			(visÅpne && oppgavestatus.kode === 'AAPEN') || (visPåVent && oppgavestatus.kode === 'VENTER'),
	);

/**
 * Sorterer reservasjonene med den som utløper først øverst. Lik utløpstid brytes
 * på reservasjonsnøkkel, slik at rekkefølgen ikke avhenger av API-rekkefølgen.
 */
export const sorterReservasjoner = (reservasjoner: ReservasjonMedOppgaverDto[]): ReservasjonMedOppgaverDto[] =>
	reservasjoner.toSorted(
		({ reservasjon: a }, { reservasjon: b }) =>
			dato(a.reservertTil)?.localeCompare(dato(b.reservertTil) ?? '') ||
			a.reservasjonsnøkkel.localeCompare(b.reservasjonsnøkkel),
	);
