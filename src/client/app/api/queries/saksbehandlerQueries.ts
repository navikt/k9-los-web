import { UseQueryOptions, keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import NavAnsatt from 'app/navAnsattTsType';
import apiPaths from 'api/apiPaths';
import { SaksbehandlerEnkel } from 'avdelingsleder/bemanning/saksbehandlerTsType';
import ReservasjonV3, { ReservasjonV3FraKøDto } from 'saksbehandler/behandlingskoer/ReservasjonV3Dto';
import { OppgaveStatus } from 'saksbehandler/oppgaveStatusTsType';
import { Søkeresultat } from 'saksbehandler/sokeboks/søkeboks-oppgave-dto';
import EndreOppgaveType from 'types/EndreOppgaveType';
import { NesteOppgaverFraKoDto } from 'types/NesteOppgaverFraKoDto';
import { OppgaveNøkkel } from 'types/OppgaveNøkkel';
import { OppgavekøV3 } from 'types/OppgavekøV3Type';
import { axiosInstance } from 'utils/reactQueryConfig';

export const useInnloggetSaksbehandler = (options?: Omit<UseQueryOptions<NavAnsatt, Error>, 'queryKey'>) =>
	useQuery({
		...options,
		queryKey: [apiPaths.saksbehandler],
		gcTime: Infinity,
		staleTime: Infinity,
		refetchOnWindowFocus: false,
	});

export const useGetAlleSaksbehandlere = (options?: Omit<UseQueryOptions<SaksbehandlerEnkel[], Error>, 'queryKey'>) =>
	useQuery<SaksbehandlerEnkel[], Error>({ queryKey: [apiPaths.hentSaksbehandlereSomSaksbehandler], ...options });

export const useAntallOppgaverIKoV3UtenReserverte = (
	koId: string,
	options: Omit<UseQueryOptions<{ antallUtenReserverte: number }, Error, { antallUtenReserverte: number }>, 'queryKey'>,
) =>
	useQuery<{ antallUtenReserverte: number }, Error, { antallUtenReserverte: number }>({
		queryKey: [apiPaths.antallOppgaverIKoV3UtenReserverte(koId)],
		...options,
	});

export const useAlleSaksbehandlerKoerV3 = (options?: Omit<UseQueryOptions<OppgavekøV3[], Error>, 'queryKey'>) =>
	useQuery<OppgavekøV3[], Error>({
		queryKey: [apiPaths.hentAlleKoerSaksbehandlerV3],
		...options,
	});

export const useNesteOppgaverFraKø = (
	id: string,
	options?: Omit<UseQueryOptions<NesteOppgaverFraKoDto, Error>, 'queryKey'>,
) =>
	useQuery<NesteOppgaverFraKoDto, Error, NesteOppgaverFraKoDto>({
		queryKey: [apiPaths.hentTiNesteIKoV3(id)],
		...options,
	});

export const useSaksbehandlerReservasjoner = (options?: Omit<UseQueryOptions<ReservasjonV3[], Error>, 'queryKey'>) =>
	useQuery<ReservasjonV3[], Error, ReservasjonV3[]>({
		queryKey: [apiPaths.saksbehandlerReservasjoner],
		...options,
	});

export const useReserverOppgaveMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		onSuccess: () => {
			queryClient.removeQueries({ queryKey: [apiPaths.hentAktivReservasjonForOppgave] });
			return Promise.all([
				queryClient.invalidateQueries({ queryKey: [apiPaths.saksbehandlerReservasjoner] }),
				queryClient.invalidateQueries({ queryKey: [apiPaths.avdelinglederReservasjoner] }),
			]);
		},
		mutationFn: (oppgaveNøkkel: OppgaveNøkkel): Promise<OppgaveStatus> =>
			axiosInstance.post(apiPaths.reserverOppgave, { oppgaveNøkkel }).then((response) => response.data),
	});
};

export const useEndreReservasjoner = (onSuccces?: () => void) => {
	const queryClient = useQueryClient();
	return useMutation<null, Error, EndreOppgaveType[]>({
		mutationFn: (data) => axiosInstance.post(apiPaths.endreReservasjoner, data),
		onSuccess: async () => {
			queryClient.removeQueries({ queryKey: [apiPaths.hentAktivReservasjonForOppgave] });
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: [apiPaths.saksbehandlerReservasjoner] }),
				queryClient.invalidateQueries({ queryKey: [apiPaths.avdelinglederReservasjoner] }),
			]);
			if (onSuccces) onSuccces();
		},
	});
};
export const usePlukkOppgaveMutation = (callback?: (oppgave: ReservasjonV3FraKøDto[]) => void) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: { oppgaveKøId: string }): Promise<ReservasjonV3FraKøDto[]> =>
			axiosInstance.post(`${apiPaths.hentOppgaveFraKoV3(data.oppgaveKøId)}`, data).then((response) => response.data),
		onSuccess: async (data: ReservasjonV3FraKøDto[]) => {
			if (callback) callback(data);
			if (data.length > 0) {
				await Promise.all([
					queryClient.invalidateQueries({ queryKey: [apiPaths.saksbehandlerReservasjoner] }),
					queryClient.invalidateQueries({ queryKey: [apiPaths.avdelinglederReservasjoner] }),
					queryClient.invalidateQueries({ queryKey: [apiPaths.hentAktivReservasjonForOppgave] }),
				]);
			}
		},
	});
};

export const useOpphevReservasjoner = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: Array<{ oppgaveNøkkel: OppgaveNøkkel }>) =>
			axiosInstance.post(apiPaths.opphevReservasjoner, data),
		onSuccess: () => {
			queryClient.removeQueries({ queryKey: [apiPaths.hentAktivReservasjonForOppgave] });
			return Promise.all([
				queryClient.invalidateQueries({ queryKey: [apiPaths.saksbehandlerReservasjoner] }),
				queryClient.invalidateQueries({ queryKey: [apiPaths.avdelinglederReservasjoner] }),
			]);
		},
	});
};

export const useForlengOppgavereservasjon = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: { oppgaveNøkkel: OppgaveNøkkel }) =>
			axiosInstance.post(apiPaths.forlengOppgavereservasjon, data),
		onSuccess: () =>
			Promise.all([
				queryClient.invalidateQueries({ queryKey: [apiPaths.saksbehandlerReservasjoner] }),
				queryClient.invalidateQueries({ queryKey: [apiPaths.avdelinglederReservasjoner] }),
			]),
	});
};

export const useSøkOppgaveV3 = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (params: { søkeord: string }): Promise<Søkeresultat> =>
			axiosInstance.post(apiPaths.sokV3, params).then((response) => response.data),
		onSuccess: () => queryClient.removeQueries({ queryKey: [apiPaths.hentAktivReservasjonForOppgave] }),
	});
};

export const useHentAktivReservasjonForOppgave = (
	enabled: boolean,
	params: {
		oppgaveEksternId: string;
		oppgaveTypeEksternId: string;
		områdeEksternId: string;
	},
) =>
	useQuery<ReservasjonV3 | null>({
		enabled,
		queryKey: [apiPaths.hentAktivReservasjonForOppgave, params],
		queryFn: (): Promise<ReservasjonV3 | null> =>
			axiosInstance.get(apiPaths.hentAktivReservasjonForOppgave, { params }).then((response) => response.data),
	});

export const useHentNyeOgFerdigstilteSisteSyvDager = (gruppe: string) =>
	useQuery<
		{
			oppdatertTidspunkt: string;
			grupper: { kode: string; navn: string }[];
			kolonner: string[];
			serier: { navn: string; data: number[] }[];
		},
		Error
	>({
		queryKey: [apiPaths.hentNyeOgFerdigstilteSisteSyvDager(gruppe)],
		placeholderData: keepPreviousData,
	});

export const useSisteOppgaverMutation = () =>
	useMutation({
		mutationFn: (data: OppgaveNøkkel) => axiosInstance.post(apiPaths.sisteOppgaver, data),
	});

export const useHentSisteOppgaver = () =>
	useQuery<{ oppgaveEksternId: string; tittel: string; url: string | undefined }[]>({
		queryKey: [apiPaths.sisteOppgaver],
		placeholderData: keepPreviousData,
	});
