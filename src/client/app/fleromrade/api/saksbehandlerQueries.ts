import { type Query, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import {
	getHentAktivReservasjonQueryKey,
	getHentAlleAktiveReservasjonerQueryKey,
	getHentOppgaverISaksbehandlerkoQueryKey,
	getHentReserverteOppgaverQueryKey,
	getHentSisteOppgaverQueryKey,
	hentOppgaverISaksbehandlerko,
	useEndreReservasjoner as useGenerertEndreReservasjoner,
	useForlengReservasjon as useGenerertForlengReservasjon,
	useOpphevReservasjoner as useGenerertOpphevReservasjoner,
	useReserverOppgave as useGenerertReserverOppgave,
	useReserverOppgaveForSaksbehandler as useGenerertReserverOppgaveForSaksbehandler,
	useHentAktivReservasjon,
	useHentAntallOppgaverUtenReserverteISaksbehandlerko,
	useHentReserverteOppgaver,
	useHentSaksbehandlereForReservasjon,
	useHentSaksbehandlereISaksbehandlerko,
	useHentSaksbehandlersOppgavekoer,
	useHentSisteOppgaver,
	useLagreSisteOppgave,
	useReserverNesteOppgaveFraSaksbehandlerko,
	useSøkEtterOppgaver,
} from 'api/generated/los';
import type {
	OppgaveNokkelDto,
	OppgaveStatusDto,
	ReservasjonEndringDto,
	ReservasjonsinfoDto,
} from 'api/generated/los.schemas';
import { useOmråde } from 'fleromrade/OmrådeContext';
import { useEffect, useRef } from 'react';

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

/**
 * Antallet er et billig kall, og brukes som signal for om neste oppgaver i køen må hentes på nytt. Andre
 * saksbehandlere plukker fra de samme køene, så vi kan ikke stole på invalidering etter egne endringer alene.
 */
export const ANTALL_I_KØ_INTERVALL_MS = 15_000;

export const useAntallIKø = (køId: number | undefined) => {
	const { urlSegment } = useOmråde();
	return useHentAntallOppgaverUtenReserverteISaksbehandlerko(urlSegment, køId, {
		query: {
			enabled: køId !== undefined,
			refetchInterval: ANTALL_I_KØ_INTERVALL_MS,
			refetchOnWindowFocus: true,
		},
	});
};

export const useSaksbehandlereIKø = (køId: number | undefined) => {
	const { urlSegment } = useOmråde();
	return useHentSaksbehandlereISaksbehandlerko(urlSegment, køId, { query: { enabled: køId !== undefined } });
};

/**
 * Listen er tung å hente, så den polles ikke selv. Den hentes på nytt når antallet i køen endrer seg. Kommer én
 * oppgave inn og én ut mellom to målinger, merker vi det ikke, men det er godt nok for en forhåndsvisning.
 */
export const useOppgaverIKø = (køId: number | undefined) => {
	const { urlSegment } = useOmråde();
	const queryClient = useQueryClient();
	const antall = useAntallIKø(køId).data?.antallUtenReserverte;
	const forrigeMåling = useRef<{ køId: number; antall: number }>(undefined);

	useEffect(() => {
		if (køId === undefined || antall === undefined) {
			return;
		}
		const forrige = forrigeMåling.current;
		forrigeMåling.current = { køId, antall };
		if (forrige?.køId === køId && forrige.antall !== antall) {
			// cancelRefetch: false lar en henting som allerede pågår (f.eks. etter egen reservasjon) fullføre.
			queryClient.invalidateQueries(
				{ queryKey: getHentOppgaverISaksbehandlerkoQueryKey(urlSegment, køId), exact: true },
				{ cancelRefetch: false },
			);
		}
	}, [queryClient, urlSegment, køId, antall]);

	return useInfiniteQuery({
		queryKey: getHentOppgaverISaksbehandlerkoQueryKey(urlSegment, køId),
		queryFn: ({ pageParam, signal }) =>
			hentOppgaverISaksbehandlerko(urlSegment, køId, { limit: 10, offset: pageParam }, undefined, signal),
		initialPageParam: 0,
		getNextPageParam: (sisteSide, _sider, offset) => (sisteSide.length < 10 ? undefined : offset + 10),
		enabled: køId !== undefined,
		gcTime: 0,
		select: ({ pages }) =>
			Array.from(new Map(pages.flat().map((oppgave) => [JSON.stringify(oppgave.oppgaveNøkkel), oppgave])).values()),
	});
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
export const useAktivReservasjon = (oppgaveNøkkel: OppgaveNokkelDto | undefined, enabled = true) => {
	const { urlSegment } = useOmråde();
	return useHentAktivReservasjon(
		urlSegment,
		oppgaveNøkkel
			? { oppgaveEksternId: oppgaveNøkkel.oppgaveEksternId, oppgaveTypeEksternId: oppgaveNøkkel.oppgaveTypeEksternId }
			: undefined,
		{ query: { enabled: !!oppgaveNøkkel && enabled, select: (data): ReservasjonsinfoDto | null => data || null } },
	);
};

/**
 * En reservasjon flytter oppgaven inn i eller ut av køene, så både listen og antallet må hentes på nytt. Nøklene er
 * én streng med kø-id-en inni, så vi matcher på sti i stedet for prefiks, og treffer alle køer i området.
 */
const erKøinnhold = (urlSegment: string) => (query: Query) => {
	const [url] = query.queryKey;
	return (
		typeof url === 'string' &&
		url.startsWith(`/api/fleromrade/${urlSegment}/saksbehandler/oppgaveko/`) &&
		(url.endsWith('/oppgaver-i-koen') || url.endsWith('/antall-uten-reserverte'))
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
			queryClient.invalidateQueries({ predicate: erKøinnhold(urlSegment) }),
		]);
	};
};

export const useReserverOppgave = () => {
	const { urlSegment } = useOmråde();
	const onSuccess = useOppdaterReservasjoner();
	const { mutateAsync, ...resten } = useGenerertReserverOppgave({ mutation: { onSuccess } });
	return {
		...resten,
		reserver: (
			oppgaveNøkkel: OppgaveNokkelDto,
			options?: { onSuccess?: (status: OppgaveStatusDto) => void; onError?: () => void },
		) => {
			void mutateAsync({
				omrade: urlSegment,
				data: {
					oppgaveEksternId: oppgaveNøkkel.oppgaveEksternId,
					oppgaveTypeEksternId: oppgaveNøkkel.oppgaveTypeEksternId,
				},
			}).then(
				(status) => options?.onSuccess?.(status),
				() => options?.onError?.(),
			);
		},
	};
};

export const usePlukkOppgave = () => {
	const { urlSegment } = useOmråde();
	const oppdaterReservasjoner = useOppdaterReservasjoner();
	const { mutate, ...resten } = useReserverNesteOppgaveFraSaksbehandlerko({
		mutation: {
			onSuccess: (reservasjoner) => (reservasjoner.length === 0 ? undefined : oppdaterReservasjoner()),
		},
	});
	return {
		...resten,
		plukk: (køId: number, options?: Parameters<typeof mutate>[1]) => mutate({ omrade: urlSegment, id: køId }, options),
	};
};

export const useReserverOppgaveForSaksbehandler = () => {
	const { urlSegment } = useOmråde();
	const onSuccess = useOppdaterReservasjoner();
	const { mutate, ...resten } = useGenerertReserverOppgaveForSaksbehandler({ mutation: { onSuccess } });
	return {
		...resten,
		reserver: (oppgaveNøkkel: OppgaveNokkelDto, navident: string, options?: Parameters<typeof mutate>[1]) =>
			mutate(
				{
					omrade: urlSegment,
					data: {
						navident,
						oppgaveNøkkel: {
							oppgaveEksternId: oppgaveNøkkel.oppgaveEksternId,
							oppgaveTypeEksternId: oppgaveNøkkel.oppgaveTypeEksternId,
						},
					},
				},
				options,
			),
	};
};

/**
 * `førOppdatering` kjøres etter at endringen er lagret, men før reservasjonslistene hentes på nytt. Tabellen over
 * reserverte oppgaver bruker den til å animere radene som flytter seg.
 */
export const useOpphevReservasjoner = (førOppdatering?: () => void) => {
	const { urlSegment } = useOmråde();
	const oppdater = useOppdaterReservasjoner();
	const { mutate, ...resten } = useGenerertOpphevReservasjoner({
		mutation: {
			onSuccess: () => {
				førOppdatering?.();
				return oppdater();
			},
		},
	});
	return {
		...resten,
		opphev: (reservasjonsnøkler: string[], options?: Parameters<typeof mutate>[1]) =>
			mutate(
				{ omrade: urlSegment, data: reservasjonsnøkler.map((reservasjonsnøkkel) => ({ reservasjonsnøkkel })) },
				options,
			),
	};
};

export const useForlengReservasjon = (førOppdatering?: () => void) => {
	const { urlSegment } = useOmråde();
	const oppdater = useOppdaterReservasjoner();
	const { mutate, ...resten } = useGenerertForlengReservasjon({
		mutation: {
			onSuccess: () => {
				førOppdatering?.();
				return oppdater();
			},
		},
	});
	return {
		...resten,
		forleng: (reservasjonsnøkkel: string) => mutate({ omrade: urlSegment, data: { reservasjonsnøkkel } }),
	};
};

export const useEndreReservasjoner = (førOppdatering?: () => void) => {
	const { urlSegment } = useOmråde();
	const oppdater = useOppdaterReservasjoner();
	const { mutate, ...resten } = useGenerertEndreReservasjoner({
		mutation: {
			onSuccess: () => {
				førOppdatering?.();
				return oppdater();
			},
		},
	});
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
	const { mutateAsync, isPending } = useLagreSisteOppgave({
		mutation: {
			onSettled: () => queryClient.invalidateQueries({ queryKey: getHentSisteOppgaverQueryKey(urlSegment) }),
		},
	});
	return {
		isPending,
		åpne: (oppgaveNøkkel: OppgaveNokkelDto, oppgavebehandlingsUrl: string) => {
			const naviger = () => window.location.assign(oppgavebehandlingsUrl);
			void mutateAsync({ omrade: urlSegment, data: oppgaveNøkkel }).then(naviger, naviger);
		},
	};
};
