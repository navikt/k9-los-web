import { HastesakIkon } from 'sharedComponents/HastesakIkon';
import KopierbarVerdi, { Kopieringsområde } from 'sharedComponents/KopierbarVerdi';
import { Button, Detail, Table } from '@navikt/ds-react';
import type { OppgaveSammendragDto } from 'api/generated/los.schemas';
import { idKolonneTittel } from 'saksbehandler/tabellvisning';
import { dateFormat } from 'utils/dateUtils';

interface Props {
	oppgaver: OppgaveSammendragDto[];
	/** Gir hver rad en knapp for å velge oppgaven, f.eks. i søket eller når køen har fritt valg av oppgave. */
	onVelgOppgave?: (oppgave: OppgaveSammendragDto) => void;
}

/**
 * Oppgaver i søkeresultatet og i neste oppgaver i køen, med samme kolonner og visning som reserverte oppgaver.
 */
const OppgaveTabell = ({ oppgaver, onVelgOppgave }: Props) => {
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
					<Table.HeaderCell scope="col">Søker</Table.HeaderCell>
					<Table.HeaderCell scope="col">{idKolonneTittel(oppgaver)}</Table.HeaderCell>
					<Table.HeaderCell scope="col">Behandlingstype</Table.HeaderCell>
					<Table.HeaderCell scope="col">Oppgave opprettet</Table.HeaderCell>
					{onVelgOppgave && <Table.HeaderCell scope="col">Handlinger</Table.HeaderCell>}
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{oppgaver.map((oppgave) => {
					const id = oppgave.saksnummer || oppgave.journalpostId;
					const idNavn = oppgave.saksnummer ? 'saksnummer' : 'journalpost-id';
					return (
						<Table.Row key={oppgave.oppgaveNøkkel.oppgaveEksternId}>
							{visHastesak && <Table.DataCell>{oppgave.hastesak && <HastesakIkon />}</Table.DataCell>}
							<Kopieringsområde>
								<Table.DataCell>
									{oppgave.person?.navn}
									{oppgave.person?.fnr && (
										<>
											<br />
											<KopierbarVerdi copyText={oppgave.person.fnr} title="Kopier fødselsnummer">
												<Detail>{oppgave.person.fnr}</Detail>
											</KopierbarVerdi>
										</>
									)}
								</Table.DataCell>
							</Kopieringsområde>
							<Kopieringsområde>
								<Table.DataCell>
									<KopierbarVerdi copyText={id} title={`Kopier ${idNavn}`}>
										{id}
									</KopierbarVerdi>
									{oppgave.oppgavestatus.kode !== 'AAPEN' && (
										<>
											<br />
											<Detail>{oppgave.oppgavestatus.navn}</Detail>
										</>
									)}
								</Table.DataCell>
							</Kopieringsområde>
							<Table.DataCell>
								{oppgave.behandlingstype?.navn}
								{oppgave.ytelse?.navn && (
									<>
										<br />
										<Detail>{oppgave.ytelse.navn}</Detail>
									</>
								)}
							</Table.DataCell>
							<Table.DataCell>{oppgave.opprettetTidspunkt && dateFormat(oppgave.opprettetTidspunkt)}</Table.DataCell>
							{onVelgOppgave && (
								<Table.DataCell>
									<Button
										variant="secondary"
										size="small"
										aria-label={`Velg oppgave ${id ?? ''}`}
										onClick={() => onVelgOppgave(oppgave)}
									>
										Velg
									</Button>
								</Table.DataCell>
							)}
						</Table.Row>
					);
				})}
			</Table.Body>
		</Table>
	);
};

export default OppgaveTabell;
