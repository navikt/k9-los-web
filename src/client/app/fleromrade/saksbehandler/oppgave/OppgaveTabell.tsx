import { HastesakIkon } from 'sharedComponents/HastesakIkon';
import KopierbarVerdi, { Kopieringsområde } from 'sharedComponents/KopierbarVerdi';
import { Detail, InlineMessage, Table } from '@navikt/ds-react';
import type { OppgaveSammendragDto } from 'api/generated/los.schemas';
import { useState } from 'react';
import { idKolonneTittel } from 'saksbehandler/tabellvisning';
import { dateFormat } from 'utils/dateUtils';
import OppgaveMeny from './OppgaveMeny';
import { useOppgaveMenyViewModel } from './oppgaveMenyViewModel';

interface Props {
	oppgaver: OppgaveSammendragDto[];
	visHandlinger?: boolean;
	visBehandlingsstatus?: boolean;
}

const OppgaveTabell = ({ oppgaver, visHandlinger = false, visBehandlingsstatus = false }: Props) => {
	const visHastesak = oppgaver.some((oppgave) => oppgave.hastesak);
	const [feilmelding, setFeilmelding] = useState<string>();
	const [valgtOppgave, setValgtOppgave] = useState<OppgaveSammendragDto>();
	const viewModel = useOppgaveMenyViewModel(valgtOppgave, () => setValgtOppgave(undefined), setFeilmelding);

	return (
		<>
			{oppgaver.length > 0 && (
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
							{visBehandlingsstatus && <Table.HeaderCell scope="col">Behandlingsstatus</Table.HeaderCell>}
							{visHandlinger && (
								<Table.HeaderCell scope="col" align="right">
									Handlinger
								</Table.HeaderCell>
							)}
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{oppgaver.map((oppgave) => {
							const id = oppgave.saksnummer || oppgave.journalpostId;
							const idNavn = oppgave.saksnummer ? 'saksnummer' : 'journalpost-id';
							return (
								<Table.Row
									key={`${oppgave.oppgaveNøkkel.områdeEksternId}|${oppgave.oppgaveNøkkel.oppgaveTypeEksternId}|${oppgave.oppgaveNøkkel.oppgaveEksternId}`}
								>
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
												{oppgave.fagsakÅr && ` (${oppgave.fagsakÅr})`}
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
									<Table.DataCell>
										{oppgave.opprettetTidspunkt && dateFormat(oppgave.opprettetTidspunkt)}
									</Table.DataCell>
									{visBehandlingsstatus && <Table.DataCell>{oppgave.behandlingsstatus?.navn}</Table.DataCell>}
									{visHandlinger && (
										<Table.DataCell align="right">
											<OppgaveMeny
												oppgave={oppgave}
												viewModel={viewModel}
												åpen={valgtOppgave === oppgave}
												onOpenChange={(åpen) => setValgtOppgave(åpen ? oppgave : undefined)}
											/>
										</Table.DataCell>
									)}
								</Table.Row>
							);
						})}
					</Table.Body>
				</Table>
			)}
			{feilmelding && (
				<InlineMessage status="error" role="alert">
					{feilmelding}
				</InlineMessage>
			)}
		</>
	);
};

export default OppgaveTabell;
