import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Modal } from '@navikt/ds-react';
import apiPaths from 'api/apiPaths';
import { LagretSøk, useEndreLagretSøk } from 'api/queries/avdelingslederQueries';
import FilterIndex from 'filter/FilterIndex';
import { RenderModalProps } from 'sharedComponents/ModalButton';

export function EndreKriterierLagretSøkModal({
	lagretSøk,
	open,
	closeModal,
}: RenderModalProps & { lagretSøk: LagretSøk }) {
	const { isError: backendError, mutate: endreLagretSøk } = useEndreLagretSøk(closeModal);

	return (
		<Modal open={open} onClose={closeModal} aria-label="Endre lagret søk" className="w-[44rem]">
			<Modal.Body>
				{open && (
					<FilterIndex
						tittel="Endre lagret søk"
						initialQuery={lagretSøk.query}
						køvisning
						avbryt={closeModal}
						lagre={(oppgaveQuery) => {
							endreLagretSøk({ ...lagretSøk, query: oppgaveQuery });
						}}
					/>
				)}
			</Modal.Body>
		</Modal>
	);
}
