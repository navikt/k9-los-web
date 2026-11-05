import { HastesakIkon } from 'sharedComponents/HastesakIkon';
import KopierbarVerdi, { Kopieringsområde } from 'sharedComponents/KopierbarVerdi';
import { ChevronRightIcon } from '@navikt/aksel-icons';
import { Detail, InlineMessage, Table } from '@navikt/ds-react';
import type { OppgaveSammendragDto } from 'api/generated/los.schemas';
import { type KeyboardEvent, type ReactElement, type ReactNode, useState } from 'react';
import { idKolonneTittel } from 'saksbehandler/tabellvisning';
import { dateFormat } from 'utils/dateUtils';
import OppgaveMeny from './OppgaveMeny';
import styles from './oppgaveTabell.module.css';

interface Props {
	oppgaver: OppgaveSammendragDto[];
	visHandlinger?: boolean;
	visBehandlingsstatus?: boolean;
	onVelgOppgave?: (oppgave: OppgaveSammendragDto) => void;
}

const Verdi = ({
	kopierbar,
	copyText,
	title,
	children,
}: {
	kopierbar: boolean;
	copyText: string;
	title: string;
	children: ReactNode;
}) =>
	kopierbar ? (
		<KopierbarVerdi copyText={copyText} title={title}>
			{children}
		</KopierbarVerdi>
	) : (
		children
	);
const Celle = ({ kopierbar, children }: { kopierbar: boolean; children: ReactElement<{ className?: string }> }) =>
	kopierbar ? <Kopieringsområde>{children}</Kopieringsområde> : children;

const OppgaveTabell = ({ oppgaver, visHandlinger = false, visBehandlingsstatus = false, onVelgOppgave }: Props) => {
	const visHastesak = oppgaver.some((oppgave) => oppgave.hastesak);
	const [feilmelding, setFeilmelding] = useState<string>();
	const klikkbarRad = !!onVelgOppgave;
	const kopierbar = !klikkbarRad;

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
								<Table.HeaderCell scope="col" align="right" className={styles.handlingskolonne}></Table.HeaderCell>
							)}
							{klikkbarRad && (
								<Table.HeaderCell scope="col">
									<span className="sr-only">Åpne oppgave</span>
								</Table.HeaderCell>
							)}
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{oppgaver.map((oppgave) => {
							const id = oppgave.saksnummer || oppgave.journalpostId;
							const idNavn = oppgave.saksnummer ? 'saksnummer' : 'journalpost-id';
							const radProps = klikkbarRad
								? {
										className: `cursor-pointer ${styles.klikkbarRad}`,
										tabIndex: 0,
										onClick: () => onVelgOppgave?.(oppgave),
										onKeyDown: (event: KeyboardEvent) => {
											if (event.key === 'Enter' || event.key === ' ') {
												event.preventDefault();
												onVelgOppgave?.(oppgave);
											}
										},
									}
								: {};
							return (
								<Table.Row
									key={`${oppgave.oppgaveNøkkel.områdeEksternId}|${oppgave.oppgaveNøkkel.oppgaveTypeEksternId}|${oppgave.oppgaveNøkkel.oppgaveEksternId}`}
									{...radProps}
								>
									{visHastesak && <Table.DataCell>{oppgave.hastesak && <HastesakIkon />}</Table.DataCell>}
									<Celle kopierbar={kopierbar}>
										<Table.DataCell>
											{oppgave.person?.navn}
											{oppgave.person?.fnr && (
												<>
													<br />
													<Verdi kopierbar={kopierbar} copyText={oppgave.person.fnr} title="Kopier fødselsnummer">
														<Detail>{oppgave.person.fnr}</Detail>
													</Verdi>
												</>
											)}
										</Table.DataCell>
									</Celle>
									<Celle kopierbar={kopierbar}>
										<Table.DataCell>
											<Verdi kopierbar={kopierbar} copyText={id} title={`Kopier ${idNavn}`}>
												{id}
												{oppgave.fagsakÅr && ` (${oppgave.fagsakÅr})`}
											</Verdi>
											{oppgave.oppgavestatus.kode !== 'AAPEN' && (
												<>
													<br />
													<Detail>{oppgave.oppgavestatus.navn}</Detail>
												</>
											)}
										</Table.DataCell>
									</Celle>
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
											<OppgaveMeny oppgave={oppgave} visFeil={setFeilmelding} />
										</Table.DataCell>
									)}
									{klikkbarRad && (
										<Table.DataCell className={styles.chevronCelle}>
											<ChevronRightIcon aria-hidden fontSize="1.25rem" className={styles.chevron} />
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
