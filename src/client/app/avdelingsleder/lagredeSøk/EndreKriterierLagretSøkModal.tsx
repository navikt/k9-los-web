import React, { useContext, useMemo } from 'react';
import { ArrowsUpDownIcon, FilterIcon, TableIcon } from '@navikt/aksel-icons';
import { Heading, Modal, Tabs } from '@navikt/ds-react';
import AppContext from 'app/AppContext';
import { LagretSøk, useEndreLagretSøk } from 'api/queries/avdelingslederQueries';
import { KøKriterieEditorContent } from 'filter/KøKriterieEditor';
import KøKriterieEditorProvider from 'filter/KøKriterieEditorProvider';
import { FeltverdiOppgavefilter, OppgavefilterKode } from 'filter/filterTsTypes';
import OppgaveSelectFelter from 'filter/parts/OppgaveSelectFelter';
import OppgaveOrderFelter from 'filter/sortering/OppgaveOrderFelter';
import { RenderModalProps } from 'sharedComponents/ModalButton';

export function EndreKriterierLagretSøkModal({
	lagretSøk,
	tittel,
	open,
	closeModal,
	modalTab,
}: RenderModalProps & { tittel: string; lagretSøk: LagretSøk; modalTab?: 'kriterier' | 'felter' | 'sortering' }) {
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

	const kriterier = (
		<KøKriterieEditorContent
			paakrevdeKoder={[OppgavefilterKode.Oppgavestatus, OppgavefilterKode.Personbeskyttelse]}
			readOnlyKoder={kode6 ? [OppgavefilterKode.Personbeskyttelse] : []}
		/>
	);

	const felter = <OppgaveSelectFelter />;

	const sortering = <OppgaveOrderFelter />;

	const innhold = (() => {
		switch (modalTab) {
			case 'kriterier':
				return kriterier;
			case 'felter':
				return felter;
			case 'sortering':
				return sortering;
			default:
				return (
					<Tabs defaultValue="kriterier">
						<Tabs.List>
							<Tabs.Tab value="kriterier" label="Kriterier" icon={<FilterIcon />} />
							<Tabs.Tab value="felter" label="Felter" icon={<TableIcon />} />
							<Tabs.Tab value="sortering" label="Sortering" icon={<ArrowsUpDownIcon />} />
						</Tabs.List>
						<div className="mt-8">
							<Tabs.Panel value="kriterier">{kriterier}</Tabs.Panel>
							<Tabs.Panel value="felter">{felter}</Tabs.Panel>
							<Tabs.Panel value="sortering">{sortering}</Tabs.Panel>
						</div>
					</Tabs>
				);
		}
	})();

	return (
		<Modal open={open} onClose={closeModal} aria-label={tittel} width={900}>
			<Modal.Header>
				<Heading size="medium">{tittel}</Heading>
			</Modal.Header>
			<Modal.Body className="p-2">
				<AppContext.Provider value={overstyrteFeltdefinisjoner}>
					<KøKriterieEditorProvider
						initialQuery={lagretSøk.query}
						lagre={(oppgaveQuery) => {
							endreLagretSøk({ ...lagretSøk, query: oppgaveQuery });
						}}
						avbryt={closeModal}
					>
						{innhold}
					</KøKriterieEditorProvider>
				</AppContext.Provider>
			</Modal.Body>
		</Modal>
	);
}
