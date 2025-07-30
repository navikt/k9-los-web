import React, { useContext, useMemo } from 'react';
import { Modal } from '@navikt/ds-react';
import AppContext from 'app/AppContext';
import { LagretSøk, useEndreLagretSøk } from 'api/queries/avdelingslederQueries';
import { useInnloggetSaksbehandler } from 'api/queries/saksbehandlerQueries';
import FilterIndex from 'filter/FilterIndex';
import { OppgavefilterKode } from 'filter/filterTsTypes';
import { RenderModalProps } from 'sharedComponents/ModalButton';

export function EndreKriterierLagretSøkModal({
	lagretSøk,
	open,
	closeModal,
}: RenderModalProps & { lagretSøk: LagretSøk }) {
	const { isError: backendError, mutate: endreLagretSøk } = useEndreLagretSøk(closeModal);
	const { data } = useInnloggetSaksbehandler();
	const feltdefinisjoner = useContext(AppContext).felter;
	const overstyrteFeltdefinisjoner = useMemo(
		() => ({
			felter: feltdefinisjoner.map((felt) => {
				if (felt.kode === OppgavefilterKode.Personbeskyttelse && !data.kanBehandleKode6) {
					return {
						...felt,
						verdiforklaringer: felt.verdiforklaringer.filter((v) => v.verdi !== 'KODE6'),
					};
				}
				return felt;
			}),
		}),
		[feltdefinisjoner, data.kanBehandleKode6],
	);
	return (
		<Modal open={open} onClose={closeModal} aria-label="Endre lagret søk" className="w-[44rem]">
			<Modal.Body>
				<AppContext.Provider value={overstyrteFeltdefinisjoner}>
					<FilterIndex
						tittel="Endre lagret søk"
						initialQuery={lagretSøk.query}
						køvisning
						avbryt={closeModal}
						paakrevdeKoder={[OppgavefilterKode.Oppgavestatus, OppgavefilterKode.Personbeskyttelse]}
						lagre={(oppgaveQuery) => {
							endreLagretSøk({ ...lagretSøk, query: oppgaveQuery });
						}}
					/>
				</AppContext.Provider>
			</Modal.Body>
		</Modal>
	);
}
