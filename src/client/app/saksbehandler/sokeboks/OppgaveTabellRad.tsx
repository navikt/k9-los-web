import React from 'react';
import Chevron from 'nav-frontend-chevron';
import { Table } from '@navikt/ds-react';
import { OppgaveModal } from 'saksbehandler/sokeboks/OppgaveModal';
import { SøkeboksOppgaveDto } from 'saksbehandler/sokeboks/SøkeboksOppgaveDto';
import { HastesakIkon } from 'sharedComponents/HastesakIkon';
import ModalButton from 'sharedComponents/ModalButton';

export function OppgaveTabellRad(props: { oppgave: SøkeboksOppgaveDto; visHastesakKolonne: boolean }) {
	return (
		<ModalButton
			renderButton={({ openModal }) => (
				<Table.Row key={props.oppgave.oppgaveNøkkel.oppgaveEksternId} onClick={openModal} className="cursor-pointer">
					{props.visHastesakKolonne && <Table.DataCell>{props.oppgave.hastesak && <HastesakIkon />}</Table.DataCell>}
					<Table.DataCell>{props.oppgave.saksnummer ?? props.oppgave.journalpostId}</Table.DataCell>
					<Table.DataCell>{props.oppgave.navn}</Table.DataCell>
					<Table.DataCell>{props.oppgave.ytelsestype.navn}</Table.DataCell>
					<Table.DataCell>{props.oppgave.oppgavestatus.navn}</Table.DataCell>
					<Table.DataCell>
						<Chevron />
					</Table.DataCell>
				</Table.Row>
			)}
			renderModal={({ open, closeModal }) => (
				<OppgaveModal oppgave={props.oppgave} open={open} closeModal={closeModal} />
			)}
		/>
	);
}
