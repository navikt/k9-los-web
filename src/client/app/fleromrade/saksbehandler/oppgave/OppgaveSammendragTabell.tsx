import { HastesakIkon } from 'sharedComponents/HastesakIkon';
import { ChevronRightIcon } from '@navikt/aksel-icons';
import { Button, Table } from '@navikt/ds-react';
import type { OppgaveSammendragDto } from 'api/generated/los.schemas';
import { dateFormat } from 'utils/dateUtils';

interface Props {
	oppgaver: OppgaveSammendragDto[];
	/** Gjør radene klikkbare. */
	onVelgOppgave?: (oppgave: OppgaveSammendragDto) => void;
}

const idKolonnetittel = (oppgaver: OppgaveSammendragDto[]) => {
	if (oppgaver.every((oppgave) => oppgave.saksnummer && !oppgave.journalpostId)) {
		return 'Saksnummer';
	}
	if (oppgaver.every((oppgave) => !oppgave.saksnummer && oppgave.journalpostId)) {
		return 'Journalpost-id';
	}
	return 'Saksnummer/journalpost-id';
};

const OppgaveSammendragTabell = ({ oppgaver, onVelgOppgave }: Props) => {
	const visHastesak = oppgaver.some((oppgave) => oppgave.hastesak);

	return (
		<Table>
			<Table.Header>
				<Table.Row>
					{visHastesak && (
						<Table.HeaderCell scope="col">
							<span className="sr-only">Hastesak</span>
						</Table.HeaderCell>
					)}
					<Table.HeaderCell scope="col">{idKolonnetittel(oppgaver)}</Table.HeaderCell>
					<Table.HeaderCell scope="col">Navn</Table.HeaderCell>
					<Table.HeaderCell scope="col">Ytelse</Table.HeaderCell>
					<Table.HeaderCell scope="col">Behandlingstype</Table.HeaderCell>
					<Table.HeaderCell scope="col">Status</Table.HeaderCell>
					<Table.HeaderCell scope="col">Opprettet</Table.HeaderCell>
					{onVelgOppgave && (
						<Table.HeaderCell scope="col">
							<span className="sr-only">Velg</span>
						</Table.HeaderCell>
					)}
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{oppgaver.map((oppgave) => (
					<Table.Row
						key={oppgave.oppgaveNøkkel.oppgaveEksternId}
						onClick={onVelgOppgave ? () => onVelgOppgave(oppgave) : undefined}
						className={onVelgOppgave ? 'cursor-pointer' : undefined}
					>
						{visHastesak && <Table.DataCell>{oppgave.hastesak && <HastesakIkon />}</Table.DataCell>}
						<Table.DataCell>
							{oppgave.saksnummer ?? oppgave.journalpostId}
							{oppgave.fagsakÅr && ` (${oppgave.fagsakÅr})`}
						</Table.DataCell>
						<Table.DataCell>{oppgave.person?.navn}</Table.DataCell>
						<Table.DataCell>{oppgave.ytelse?.navn}</Table.DataCell>
						<Table.DataCell>{oppgave.behandlingstype?.navn}</Table.DataCell>
						<Table.DataCell>{oppgave.oppgavestatus.navn}</Table.DataCell>
						<Table.DataCell>{oppgave.opprettetTidspunkt && dateFormat(oppgave.opprettetTidspunkt)}</Table.DataCell>
						{onVelgOppgave && (
							<Table.DataCell>
								<Button
									variant="tertiary"
									size="small"
									icon={
										<ChevronRightIcon title={`Velg oppgave ${oppgave.saksnummer ?? oppgave.journalpostId ?? ''}`} />
									}
									onClick={(event) => {
										event.stopPropagation();
										onVelgOppgave(oppgave);
									}}
								/>
							</Table.DataCell>
						)}
					</Table.Row>
				))}
			</Table.Body>
		</Table>
	);
};

export default OppgaveSammendragTabell;
