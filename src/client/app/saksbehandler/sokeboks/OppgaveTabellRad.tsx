import React, { ReactNode } from 'react';
import Chevron from 'nav-frontend-chevron';
import { Table } from '@navikt/ds-react';
import { OppgaveModal } from 'saksbehandler/sokeboks/OppgaveModal';
import { SøkeboksOppgaveDto } from 'saksbehandler/sokeboks/søkeboks-oppgave-dto';
import { HastesakIkon } from 'sharedComponents/HastesakIkon';

export function OppgaveTabellRad(props: {
	oppgave: SøkeboksOppgaveDto;
	visHastesakKolonne: boolean;
	setModal: (modal: ReactNode) => void;
}) {
	const openModal = () => {
		props.setModal(<OppgaveModal oppgave={props.oppgave} open closeModal={() => props.setModal(null)} />);
	};

	return (
		<Table.Row key={props.oppgave.oppgaveNøkkel.oppgaveEksternId} onClick={openModal} className="cursor-pointer">
			{props.visHastesakKolonne && <Table.DataCell>{props.oppgave.hastesak && <HastesakIkon />}</Table.DataCell>}
			<Table.DataCell>
				{props.oppgave.saksnummer ?? props.oppgave.journalpostId}{' '}
				{props.oppgave.fagsakÅr && `(${props.oppgave.fagsakÅr})`}
			</Table.DataCell>
			<Table.DataCell>{props.oppgave.navn}</Table.DataCell>
			<Table.DataCell>{props.oppgave.ytelsestype}</Table.DataCell>
			<Table.DataCell>{props.oppgave.status}</Table.DataCell>
			<Table.DataCell>
				<Chevron />
			</Table.DataCell>
		</Table.Row>
	);
}
