import { HastesakIkon } from 'sharedComponents/HastesakIkon';
import KopierbarVerdi, { Kopieringsområde } from 'sharedComponents/KopierbarVerdi';
import { Button, Detail, Table } from '@navikt/ds-react';
import type { OppgaveSammendragDto } from 'api/generated/los.schemas';
import type { KeyboardEvent, ReactElement, ReactNode } from 'react';
import { idKolonneTittel } from 'saksbehandler/tabellvisning';
import { dateFormat } from 'utils/dateUtils';

interface Props {
	oppgaver: OppgaveSammendragDto[];
	/**
	 * Hvordan en oppgave velges. `knapp` gir hver rad en Velg-knapp (neste oppgaver når køen har fritt valg).
	 * `rad` gjør hele raden klikkbar og uten kopiknapper (søkeresultatet).
	 */
	velg?: { med: 'knapp' | 'rad'; onVelgOppgave: (oppgave: OppgaveSammendragDto) => void };
}

/** Viser verdien med kopiknapp, eller bare verdien når tabellen ikke skal ha kopiknapper. */
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

/**
 * Oppgaver i søkeresultatet og i neste oppgaver i køen, med samme kolonner og visning som reserverte oppgaver.
 */
const OppgaveTabell = ({ oppgaver, velg }: Props) => {
	const visHastesak = oppgaver.some((oppgave) => oppgave.hastesak);
	const klikkbarRad = velg?.med === 'rad';
	const kopierbar = !klikkbarRad;

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
					{velg?.med === 'knapp' && <Table.HeaderCell scope="col">Handlinger</Table.HeaderCell>}
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{oppgaver.map((oppgave) => {
					const id = oppgave.saksnummer || oppgave.journalpostId;
					const idNavn = oppgave.saksnummer ? 'saksnummer' : 'journalpost-id';
					const velgOppgave = () => velg?.onVelgOppgave(oppgave);
					const radProps = klikkbarRad
						? {
								className: 'cursor-pointer',
								tabIndex: 0,
								onClick: velgOppgave,
								onKeyDown: (event: KeyboardEvent) => {
									if (event.key === 'Enter' || event.key === ' ') {
										event.preventDefault();
										velgOppgave();
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
							<Table.DataCell>{oppgave.opprettetTidspunkt && dateFormat(oppgave.opprettetTidspunkt)}</Table.DataCell>
							{velg?.med === 'knapp' && (
								<Table.DataCell>
									<Button
										variant="secondary"
										size="small"
										aria-label={`Velg oppgave ${id ?? ''}`}
										onClick={velgOppgave}
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
