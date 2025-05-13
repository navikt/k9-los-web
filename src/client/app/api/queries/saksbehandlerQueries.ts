import {
	UseMutationOptions,
	UseQueryOptions,
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';
import NavAnsatt from 'app/navAnsattTsType';
import apiPaths from 'api/apiPaths';
import { SaksbehandlerEnkel } from 'avdelingsleder/bemanning/saksbehandlerTsType';
import ReservasjonV3, { ReservasjonV3FraKøDto } from 'saksbehandler/behandlingskoer/ReservasjonV3Dto';
import { OppgavekøV1 } from 'saksbehandler/behandlingskoer/oppgavekoTsType';
import { SokeResultat } from 'saksbehandler/fagsakSearch/sokeResultatTsType';
import { OppgaveStatus } from 'saksbehandler/oppgaveStatusTsType';
import Oppgave from 'saksbehandler/oppgaveTsType';
import { SøkeboksOppgaveDto } from 'saksbehandler/sokeboks/SøkeboksOppgaveDto';
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

export const useAlleSaksbehandlerKoerV1 = (options?: Omit<UseQueryOptions<OppgavekøV1[], Error>, 'queryKey'>) =>
	useQuery<OppgavekøV1[], Error>({
		queryKey: [apiPaths.hentAlleKoerSaksbehandlerV1],
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

export const useSaksbehandlerNesteTiV1 = (id: string, options?: Omit<UseQueryOptions<Oppgave[], Error>, 'queryKey'>) =>
	useQuery<Oppgave[], Error, Oppgave[]>({
		queryKey: [apiPaths.saksbehandlerNesteOppgaver(id)],
		...options,
	});

export const useSaksbehandlerReservasjoner = (options?: Omit<UseQueryOptions<ReservasjonV3[], Error>, 'queryKey'>) =>
	useQuery<ReservasjonV3[], Error, ReservasjonV3[]>({
		queryKey: [apiPaths.saksbehandlerReservasjoner],
		...options,
	});
export const useSøk = (options?: UseMutationOptions<SokeResultat, Error, string>) =>
	useMutation({
		...options,
		mutationFn: (searchString: string): Promise<SokeResultat> =>
			axiosInstance.post(apiPaths.sok, { searchString }).then((response) => response.data),
	});

export const useReserverOppgaveMutation = (onSuccess?: () => void) => {
	const queryClient = useQueryClient();
	return useMutation({
		onSuccess: () => {
			queryClient.refetchQueries({ queryKey: [apiPaths.saksbehandlerReservasjoner] });
			queryClient.refetchQueries({ queryKey: [apiPaths.avdelinglederReservasjoner] });
			if (onSuccess) onSuccess();
		},
		mutationFn: (oppgaveNøkkel: OppgaveNøkkel): Promise<OppgaveStatus> =>
			axiosInstance.post(apiPaths.reserverOppgave, { oppgaveNøkkel }).then((response) => response.data),
	});
};

export const useEndreReservasjoner = (onSuccess?: () => void) => {
	const queryClient = useQueryClient();
	return useMutation<OppgaveStatus, Error, EndreOppgaveType[]>({
		mutationFn: (data) => axiosInstance.post(apiPaths.endreReservasjoner, data),
		onSuccess: () => {
			queryClient.refetchQueries({ queryKey: [apiPaths.saksbehandlerReservasjoner] });
			queryClient.refetchQueries({ queryKey: [apiPaths.avdelinglederReservasjoner] });
			if (onSuccess) onSuccess();
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
				await queryClient.refetchQueries({ queryKey: [apiPaths.saksbehandlerReservasjoner] });
			}
		},
	});
};

export const useOpphevReservasjoner = (onSuccess?: () => void) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: Array<{ oppgaveNøkkel: OppgaveNøkkel }>) =>
			axiosInstance.post(apiPaths.opphevReservasjoner, data),
		onSuccess: () => {
			queryClient.refetchQueries({ queryKey: [apiPaths.saksbehandlerReservasjoner] });
			queryClient.refetchQueries({ queryKey: [apiPaths.avdelinglederReservasjoner] });
			if (onSuccess) onSuccess();
		},
	});
};

export const useSøkOppgaveV3 = () =>
	useMutation({
		mutationFn: (params: { searchString: string; fraAktiv: boolean }): Promise<SøkeboksOppgaveDto[]> =>
			axiosInstance.post(apiPaths.sokV3, params).then((response) => response.data),
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
