import React, { useContext, useMemo } from 'react';
import { Modal } from '@navikt/ds-react';
import AppContext from 'app/AppContext';
import { LagretSøk, useEndreLagretSøk } from 'api/queries/avdelingslederQueries';
import KøKriterieEditor from 'filter/KøKriterieEditor';
import { FeltverdiOppgavefilter, OppgavefilterKode } from 'filter/filterTsTypes';
import { RenderModalProps } from 'sharedComponents/ModalButton';

export function EndreKriterierLagretSøkModal({
	lagretSøk,
	open,
	closeModal,
}: RenderModalProps & { lagretSøk: LagretSøk }) {
	const { isError: backendError, mutate: endreLagretSøk } = useEndreLagretSøk(closeModal);

	// Backend vil lage default query med/uten kode6, og låser her valgene ihht. eksisterende query.
	// Dette er ikke for å iverta sikkerhet. Antar at backend vil håndtere dette.
	const kode6 =
		lagretSøk.query.filtere.find((filter) => {
			if (filter.type !== 'feltverdi') return false;
			const { kode, verdi } = filter as FeltverdiOppgavefilter;
			return kode === OppgavefilterKode.Personbeskyttelse && verdi.includes('KODE6');
		}) !== undefined;
	const feltdefinisjoner = useContext(AppContext).felter;
	const overstyrteFeltdefinisjoner = useMemo(
		() => ({
			felter: feltdefinisjoner.map((felt) => {
				if (felt.kode === OppgavefilterKode.Personbeskyttelse) {
					return {
						...felt,
						verdiforklaringer: kode6
							? felt.verdiforklaringer.filter((v) => v.verdi === 'KODE6')
							: felt.verdiforklaringer.filter((v) => v.verdi !== 'KODE6'),
					};
				}
				return felt;
			}),
		}),
		[feltdefinisjoner, kode6],
	);
	return (
		<Modal open={open} onClose={closeModal} aria-label="Endre lagret søk" className="w-[44rem]" width={800}>
			<Modal.Body>
				<AppContext.Provider value={overstyrteFeltdefinisjoner}>
					<KøKriterieEditor
						tittel="Endre lagret søk"
						initialQuery={lagretSøk.query}
						avbryt={closeModal}
						paakrevdeKoder={[OppgavefilterKode.Oppgavestatus, OppgavefilterKode.Personbeskyttelse]}
						readOnlyKoder={kode6 ? [OppgavefilterKode.Personbeskyttelse] : []}
						lagre={(oppgaveQuery) => {
							endreLagretSøk({ ...lagretSøk, query: oppgaveQuery });
						}}
					/>
				</AppContext.Provider>
			</Modal.Body>
		</Modal>
	);
}
