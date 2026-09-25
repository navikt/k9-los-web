import { useMutation } from '@tanstack/react-query';
import { hentAntallOppgaverForQuery, useHentOppgavefelter, validerOppgaveQuery } from 'api/generated/los';
import type { Oppgavefelt, OppgaveQuery } from 'filter/filterTsTypes';
import { useOmråde } from 'fleromrade/OmrådeContext';
import { tilKlientQuery } from './oppgaveQuery';

/** Oppgavefeltene for området, i formen `filter/` forventer. */
export const useOppgavefelter = () => {
	const { urlSegment } = useOmråde();
	return useHentOppgavefelter(urlSegment, {
		query: {
			staleTime: Infinity,
			// Generert type har bredere enum-typer for `synlighet` og `tolkes_som` enn `filter/`.
			select: (data) => data as unknown as Oppgavefelt[],
		},
	});
};

export const useValiderOppgaveQuery = () => {
	const { urlSegment } = useOmråde();
	return useMutation<boolean, Error, OppgaveQuery>({
		mutationFn: (query) => validerOppgaveQuery(urlSegment, tilKlientQuery(query)),
	});
};

export const useHentAntallOppgaver = () => {
	const { urlSegment } = useOmråde();
	return useMutation<number, Error, OppgaveQuery>({
		mutationFn: (query) => hentAntallOppgaverForQuery(urlSegment, tilKlientQuery(query)),
	});
};
