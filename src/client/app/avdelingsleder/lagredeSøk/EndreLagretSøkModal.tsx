import React from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { Alert, Button, Heading, Modal, TextField } from '@navikt/ds-react';
import apiPaths from 'api/apiPaths';
import {
	LagretSøk,
	useEndreLagretSøk,
	useHentLagredeSøk,
	useOpprettLagretSøk,
} from 'api/queries/avdelingslederQueries';
import FilterIndex from 'filter/FilterIndex';
import { OppgaveQuery } from 'filter/filterTsTypes';
import { RenderModalProps } from 'sharedComponents/ModalButton';

interface FormData {
	tittel: string;
	query: OppgaveQuery;
}

export function EndreLagretSøkModal({ lagretSøk, open, closeModal }: RenderModalProps & { lagretSøk: LagretSøk }) {
	const queryClient = useQueryClient();
	const { isError: backendError, mutate: endreLagretSøk } = useEndreLagretSøk();

	return (
		<Modal open={open} onClose={closeModal} aria-label="Endre lagret søk" className="w-[44rem]">
			<Modal.Body>
				<FilterIndex
					tittel="Endre lagret søk"
					initialQuery={lagretSøk.query}
					køvisning
					avbryt={closeModal}
					lagre={(oppgaveQuery) => {
						endreLagretSøk({ ...lagretSøk, query: oppgaveQuery });
						queryClient.invalidateQueries({ queryKey: [apiPaths.hentLagredeSøk] }).then(closeModal);
					}}
				/>
			</Modal.Body>
		</Modal>
	);
}
