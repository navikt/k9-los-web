import { useMutation } from '@tanstack/react-query';
import apiPaths from 'api/apiPaths';
import { OppgaveQuery, Oppgaverad } from 'filter/filterTsTypes';
import { axiosInstance } from 'utils/reactQueryConfig';

/**
 * Mutation for å søke etter oppgaver basert på en OppgaveQuery.
 * Returnerer en liste av Oppgaverad.
 */
export const useSøkOppgaver = () =>
	useMutation<Oppgaverad[], Error, OppgaveQuery>({
		mutationFn: (oppgaveQuery: OppgaveQuery) =>
			axiosInstance.post(apiPaths.hentOppgaver, oppgaveQuery).then((response) => response.data),
	});

/**
 * Mutation for å laste ned oppgaver som CSV-fil.
 * Bruker responseType: 'blob' for å håndtere binær fil-respons.
 */
export const useLastNedOppgaverSomFil = () =>
	useMutation<Blob, Error, OppgaveQuery>({
		mutationFn: async (oppgaveQuery: OppgaveQuery) => {
			const response = await axiosInstance.post(apiPaths.hentOppgaverSomFil, oppgaveQuery, {
				responseType: 'blob',
			});

			// Åpne blob i nytt vindu (simulerer withPostAndOpenBlob)
			const blob = new Blob([response.data], { type: 'text/csv' });
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = `oppgaver_${new Date().toISOString()}.csv`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);

			return response.data;
		},
	});

/**
 * Mutation for å validere en OppgaveQuery.
 * Returnerer boolean som indikerer om querien er gyldig.
 */
export const useValiderOppgaveQuery = () =>
	useMutation<boolean, Error, OppgaveQuery>({
		mutationFn: (oppgaveQuery: OppgaveQuery) =>
			axiosInstance.post(apiPaths.validerQuery, oppgaveQuery).then((response) => response.data),
	});

/**
 * Mutation for å hente antall oppgaver basert på en OppgaveQuery.
 * Returnerer antallet som number.
 */
export const useHentAntallOppgaver = () =>
	useMutation<number, Error, OppgaveQuery>({
		mutationFn: (oppgaveQuery: OppgaveQuery) =>
			axiosInstance.post(apiPaths.hentAntallOppgaver, oppgaveQuery).then((response) => response.data),
	});