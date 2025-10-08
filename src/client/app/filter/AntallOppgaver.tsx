import React, { useContext, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { ArrowsCirclepathIcon } from '@navikt/aksel-icons';
import { Button, Label, Skeleton } from '@navikt/ds-react';
import apiPaths from 'api/apiPaths';
import { FilterContext } from './FilterContext';
import { OppgaveQuery } from './filterTsTypes';

interface OwnProps {
	setQueryError: (error: string) => void;
}

export const AntallOppgaver = ({ setQueryError }: OwnProps) => {
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

	const hentOppgaver = async () => {
		mutate({ url: apiPaths.hentAntallOppgaver, body: oppgaveQuery });
	};
	return (
		<div className="flex flex-col">
			<Label size="small">
				Antall oppgaver: {isPending ? <Skeleton className="inline-block w-12" /> : antallOppgaver}
			</Label>
			<Button
				variant="tertiary"
				icon={<ArrowsCirclepathIcon aria-hidden />}
				size="small"
				onClick={hentOppgaver}
				loading={isPending}
				disabled={isPending}
			>
				Oppdater antall
			</Button>
		</div>
	);
};
