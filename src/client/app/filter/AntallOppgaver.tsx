import React, { useContext, useState } from 'react';
import { UseMutationResult, useMutation } from '@tanstack/react-query';
import { ArrowsCirclepathIcon } from '@navikt/aksel-icons';
import { Button, Label, Skeleton } from '@navikt/ds-react';
import apiPaths from 'api/apiPaths';
import { FilterContext } from './FilterContext';
import { OppgaveQuery } from './filterTsTypes';

interface OwnProps {
	setQueryError: (error: string) => void;
	validerMutation: UseMutationResult<boolean, Error, OppgaveQuery>;
}

export const AntallOppgaver = ({ setQueryError, validerMutation }: OwnProps) => {
	const { oppgaveQuery } = useContext(FilterContext);

	const [antallOppgaver, setAntallOppgaver] = useState('');
	const { mutate, isPending } = useMutation<string, unknown, { url: string; body: OppgaveQuery }>({
		onSuccess: (respons) => {
			if (respons !== undefined) {
				setAntallOppgaver(respons);
				setQueryError('');
			}
		},
		onError: () => {
			setQueryError('Noe gikk galt ved henting av antall oppgaver. Prøv igjen senere.');
		},
	});

	const hentOppgaver = () => {
		validerMutation.mutate(oppgaveQuery, {
			onSuccess: (valideringOK) => {
				if (valideringOK) {
					mutate({ url: apiPaths.hentAntallOppgaver, body: oppgaveQuery });
				} else {
					setQueryError('Kriteriene er ikke gyldige.');
				}
			},
			onError: () => {
				setQueryError('Kunne ikke validere query.');
			},
		});
	};
	const isLoading = isPending || validerMutation.isPending;

	return (
		<div className="flex flex-col">
			<Label size="small">
				Antall oppgaver: {isLoading ? <Skeleton className="inline-block w-12" /> : antallOppgaver}
			</Label>
			<Button
				variant="tertiary"
				icon={<ArrowsCirclepathIcon aria-hidden />}
				size="small"
				onClick={hentOppgaver}
				loading={isLoading}
				disabled={isLoading}
			>
				Oppdater antall
			</Button>
		</div>
	);
};
