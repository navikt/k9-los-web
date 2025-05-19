import React from 'react';
import Chevron from 'nav-frontend-chevron';
import { Table } from '@navikt/ds-react';
import { OppgaveModal } from 'saksbehandler/sokeboks-ny/OppgaveModal';
import { SøkeboksOppgaveDto } from 'saksbehandler/sokeboks-ny/søkeboks-oppgave-dto';
import { HastesakIkon } from 'sharedComponents/HastesakIkon';
import ModalButton from 'sharedComponents/ModalButton';

// ny
export function OppgaveTabellRad(props: { oppgave: SøkeboksOppgaveDto; visHastesakKolonne: boolean }) {
	return (
		<ModalButton
			renderButton={({ openModal }) => (
				<Table.Row key={props.oppgave.oppgaveNøkkel.oppgaveEksternId} onClick={openModal} className="cursor-pointer">
					{props.visHastesakKolonne && <Table.DataCell>{props.oppgave.hastesak && <HastesakIkon />}</Table.DataCell>}
					<Table.DataCell>{props.oppgave.saksnummer ?? props.oppgave.journalpostId}</Table.DataCell>
					<Table.DataCell>{props.oppgave.navn}</Table.DataCell>
					<Table.DataCell>{props.oppgave.ytelsestype}</Table.DataCell>
					<Table.DataCell>{props.oppgave.status}</Table.DataCell>
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
