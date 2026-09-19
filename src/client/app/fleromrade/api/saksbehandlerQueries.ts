import { useQueryClient } from '@tanstack/react-query';
import {
	getHentAktivReservasjonQueryKey,
	getHentAlleAktiveReservasjonerQueryKey,
	getHentAntallOppgaverUtenReserverteISaksbehandlerkoQueryKey,
	getHentReserverteOppgaverQueryKey,
	getHentSisteOppgaverQueryKey,
	useEndreReservasjoner as useGenerertEndreReservasjoner,
	useForlengReservasjon as useGenerertForlengReservasjon,
	useOpphevReservasjoner as useGenerertOpphevReservasjoner,
	useReserverOppgave as useGenerertReserverOppgave,
	useHentAktivReservasjon,
	useHentAntallOppgaverUtenReserverteISaksbehandlerko,
	useHentOppgaverISaksbehandlerko,
	useHentReserverteOppgaver,
	useHentSaksbehandlereForReservasjon,
	useHentSaksbehandlereISaksbehandlerko,
	useHentSaksbehandlersOppgavekoer,
	useHentSisteOppgaver,
	useLagreSisteOppgave,
	useReserverNesteOppgaveFraSaksbehandlerko,
	useSøkEtterOppgaver,
} from 'api/generated/los';
import type { OppgaveNokkelDto, ReservasjonEndringDto, ReservasjonV3Dto } from 'api/generated/los.schemas';
import { useOmråde } from 'fleromrade/OmrådeContext';

/**
 * Omslutter de genererte hookene for saksbehandler. Setter område fra konteksten, og oppdaterer
 * reservasjonslistene etter endringer, slik legacy-hookene gjorde.
 */

export const useSøk = () => {
	const { urlSegment } = useOmråde();
	const { mutate, ...resten } = useSøkEtterOppgaver();
	return { ...resten, søk: (søkeord: string) => mutate({ omrade: urlSegment, data: { søkeord } }) };
};

export const useSaksbehandlersKøer = () => {
	const { urlSegment } = useOmråde();
	return useHentSaksbehandlersOppgavekoer(urlSegment);
};

export const useAntallIKø = (køId: number | undefined) => {
	const { urlSegment } = useOmråde();
	return useHentAntallOppgaverUtenReserverteISaksbehandlerko(urlSegment, køId, {
		query: { enabled: køId !== undefined },
	});
};

export const useSaksbehandlereIKø = (køId: number | undefined) => {
	const { urlSegment } = useOmråde();
	return useHentSaksbehandlereISaksbehandlerko(urlSegment, køId, { query: { enabled: køId !== undefined } });
};

export const useOppgaverIKø = (køId: number | undefined) => {
	const { urlSegment } = useOmråde();
	return useHentOppgaverISaksbehandlerko(urlSegment, køId, { query: { enabled: køId !== undefined } });
};

export const useReserverteOppgaver = () => {
	const { urlSegment } = useOmråde();
	return useHentReserverteOppgaver(urlSegment);
};

export const useSaksbehandlereForReservasjon = () => {
	const { urlSegment } = useOmråde();
	return useHentSaksbehandlereForReservasjon(urlSegment);
};

export const useSisteOppgaver = () => {
	const { urlSegment } = useOmråde();
	return useHentSisteOppgaver(urlSegment);
};

/** Aktiv reservasjon for en oppgave, eller `null` når oppgaven ikke er reservert (backend svarer 204). */
export const useAktivReservasjon = (oppgaveNøkkel: OppgaveNokkelDto, enabled = true) => {
	const { urlSegment } = useOmråde();
	return useHentAktivReservasjon(
		urlSegment,
		{ oppgaveEksternId: oppgaveNøkkel.oppgaveEksternId, oppgaveTypeEksternId: oppgaveNøkkel.oppgaveTypeEksternId },
		{ query: { enabled, select: (data): ReservasjonV3Dto | null => data || null } },
	);
};

const useOppdaterReservasjoner = () => {
	const queryClient = useQueryClient();
	const { urlSegment } = useOmråde();
	return () => {
		queryClient.removeQueries({ queryKey: getHentAktivReservasjonQueryKey(urlSegment) });
		return Promise.all([
			queryClient.invalidateQueries({ queryKey: getHentReserverteOppgaverQueryKey(urlSegment) }),
			queryClient.invalidateQueries({ queryKey: getHentAlleAktiveReservasjonerQueryKey(urlSegment) }),
		]);
	};
};

export const useReserverOppgave = () => {
	const { urlSegment } = useOmråde();
	const onSuccess = useOppdaterReservasjoner();
	const { mutate, ...resten } = useGenerertReserverOppgave({ mutation: { onSuccess } });
	return {
		...resten,
		reserver: (oppgaveNøkkel: OppgaveNokkelDto, options?: Parameters<typeof mutate>[1]) =>
			mutate({ omrade: urlSegment, data: { oppgaveNøkkel, overstyrSjekk: false } }, options),
	};
};

export const usePlukkOppgave = () => {
	const { urlSegment } = useOmråde();
	const queryClient = useQueryClient();
	const oppdaterReservasjoner = useOppdaterReservasjoner();
	const { mutate, ...resten } = useReserverNesteOppgaveFraSaksbehandlerko({
		mutation: {
			onSuccess: (reservasjoner, { id }) => {
				if (reservasjoner.length === 0) {
					return undefined;
				}
				return Promise.all([
					oppdaterReservasjoner(),
					queryClient.invalidateQueries({
						queryKey: getHentAntallOppgaverUtenReserverteISaksbehandlerkoQueryKey(urlSegment, id),
					}),
				]);
			},
		},
	});
	return {
		...resten,
		plukk: (køId: number, options?: Parameters<typeof mutate>[1]) => mutate({ omrade: urlSegment, id: køId }, options),
	};
};

export const useOpphevReservasjoner = () => {
	const { urlSegment } = useOmråde();
	const onSuccess = useOppdaterReservasjoner();
	const { mutate, ...resten } = useGenerertOpphevReservasjoner({ mutation: { onSuccess } });
	return {
		...resten,
		opphev: (reservasjonsnøkler: string[], options?: Parameters<typeof mutate>[1]) =>
			mutate(
				{ omrade: urlSegment, data: reservasjonsnøkler.map((reservasjonsnøkkel) => ({ reservasjonsnøkkel })) },
				options,
			),
	};
};

export const useForlengReservasjon = () => {
	const { urlSegment } = useOmråde();
	const onSuccess = useOppdaterReservasjoner();
	const { mutate, ...resten } = useGenerertForlengReservasjon({ mutation: { onSuccess } });
	return {
		...resten,
		forleng: (reservasjonsnøkkel: string) => mutate({ omrade: urlSegment, data: { reservasjonsnøkkel } }),
	};
};

export const useEndreReservasjoner = () => {
	const { urlSegment } = useOmråde();
	const onSuccess = useOppdaterReservasjoner();
	const { mutate, ...resten } = useGenerertEndreReservasjoner({ mutation: { onSuccess } });
	return {
		...resten,
		endre: (endringer: ReservasjonEndringDto[], options?: Parameters<typeof mutate>[1]) =>
			mutate({ omrade: urlSegment, data: endringer }, options),
	};
};

/**
 * Lagrer oppgaven i siste oppgaver og sender brukeren til fagsystemet. Navigerer uansett utfall av lagringen,
 * siden siste oppgaver ikke er kritisk.
 */
export const useÅpneOppgave = () => {
	const { urlSegment } = useOmråde();
	const queryClient = useQueryClient();
	const { mutate, isPending } = useLagreSisteOppgave({
		mutation: {
			onSettled: () => queryClient.invalidateQueries({ queryKey: getHentSisteOppgaverQueryKey(urlSegment) }),
		},
	});
	return {
		isPending,
		åpne: (oppgaveNøkkel: OppgaveNokkelDto, oppgavebehandlingsUrl: string) =>
			mutate(
				{ omrade: urlSegment, data: oppgaveNøkkel },
				{ onSettled: () => window.location.assign(oppgavebehandlingsUrl) },
			),
	};
};
