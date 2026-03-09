import React, { useContext, useMemo } from 'react';
import { Heading, Modal } from '@navikt/ds-react';
import AppContext from 'app/AppContext';
import { LagretSøk, useEndreLagretSøk, useNyttLagretSøk } from 'api/queries/avdelingslederQueries';
import { KøKriterieEditorContent } from 'filter/KøKriterieEditor';
import KøKriterieEditorProvider from 'filter/KøKriterieEditorProvider';
import { FeltverdiOppgavefilter, OppgaveQuery, OppgavefilterKode } from 'filter/filterTsTypes';
import { RenderModalProps } from 'sharedComponents/ModalButton';

type EndreKriterierProps = RenderModalProps & {
	tittel: string;
	onNyOpprettet?: (id: number) => void;
} & ({ lagretSøk: LagretSøk; initialQuery?: never } | { initialQuery: OppgaveQuery; lagretSøk?: never });

export function EndreKriterierLagretSøkModal({
	lagretSøk,
	initialQuery,
	tittel,
	open,
	closeModal,
	onNyOpprettet,
}: EndreKriterierProps) {
	const { mutate: endreLagretSøk } = useEndreLagretSøk(closeModal);
	const { mutate: nyttLagretSøk } = useNyttLagretSøk((id) => {
		closeModal();
		onNyOpprettet?.(id);
	});

	const query = lagretSøk?.query ?? initialQuery;

	// Backend vil lage default query med/uten kode6, og låser her valgene ihht. eksisterende query.
	// Dette er ikke for å iverta sikkerhet. Antar at backend vil håndtere dette.
	const kode6 =
		query.filtere.find((filter) => {
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
		<Modal open={open} onClose={closeModal} aria-label={tittel} width={900} placement="top">
			<Modal.Header>
				<Heading size="medium">{tittel}</Heading>
			</Modal.Header>
			<Modal.Body className="p-2">
				<AppContext.Provider value={overstyrteFeltdefinisjoner}>
					<KøKriterieEditorProvider
						initialQuery={query}
						lagre={(oppgaveQuery) => {
							if (lagretSøk) {
								endreLagretSøk({ ...lagretSøk, query: oppgaveQuery });
							} else {
								nyttLagretSøk({ tittel: '', query: oppgaveQuery });
							}
						}}
						avbryt={closeModal}
						hovedknappTekst={lagretSøk ? 'Lagre' : 'Opprett'}
					>
						<KøKriterieEditorContent
							paakrevdeKoder={[OppgavefilterKode.Oppgavestatus, OppgavefilterKode.Personbeskyttelse]}
							readOnlyKoder={kode6 ? [OppgavefilterKode.Personbeskyttelse] : []}
						/>
					</KøKriterieEditorProvider>
				</AppContext.Provider>
			</Modal.Body>
		</Modal>
	);
}
