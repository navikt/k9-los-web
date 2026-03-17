import { useMutation } from '@tanstack/react-query';
import apiPaths from 'api/apiPaths';
import { OppgaveQuery, Oppgaverad } from 'filter/filterTsTypes';
import { axiosInstance } from 'utils/reactQueryConfig';

export const useSøkOppgaver = () =>
	useMutation<Oppgaverad[], Error, OppgaveQuery>({
		mutationFn: (oppgaveQuery: OppgaveQuery) =>
			axiosInstance.post(apiPaths.hentOppgaver, oppgaveQuery).then((response) => response.data),
	});

export const useValiderOppgaveQuery = () =>
	useMutation<boolean, Error, OppgaveQuery>({
		mutationFn: (oppgaveQuery: OppgaveQuery) =>
			axiosInstance.post(apiPaths.validerQuery, oppgaveQuery).then((response) => response.data),
	});

export const useHentAntallOppgaver = () =>
	useMutation<number, Error, OppgaveQuery>({
		mutationFn: (oppgaveQuery: OppgaveQuery) =>
			axiosInstance.post(apiPaths.hentAntallOppgaver, oppgaveQuery).then((response) => response.data),
	});
