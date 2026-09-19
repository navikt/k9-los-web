import { ChatElipsisIcon, MenuElipsisVerticalIcon } from '@navikt/aksel-icons';
import {
	ActionMenu,
	BodyShort,
	Button,
	Heading,
	HStack,
	InlineMessage,
	Link,
	Loader,
	Popover,
	Table,
	Tag,
	VStack,
} from '@navikt/ds-react';
import type { GenerellOppgaveV3Dto, ReservasjonV3Dto } from 'api/generated/los.schemas';
import { useForlengReservasjon, useReserverteOppgaver, useÅpneOppgave } from 'fleromrade/api/saksbehandlerQueries';
import { type ReactNode, useRef, useState } from 'react';
import { dateFormat, dateTimeFormat } from 'utils/dateUtils';
import { visningsnavn } from '../visningsnavn';
import FlyttReservasjonModal from './FlyttReservasjonModal';
import OpphevReservasjonModal from './OpphevReservasjonModal';

const Kommentar = ({ reservasjon }: { reservasjon: ReservasjonV3Dto }) => {
	const knapp = useRef<HTMLButtonElement>(null);
	const [åpen, setÅpen] = useState(false);

	if (!reservasjon.kommentar) {
		return null;
	}

	return (
		<>
			<Button
				ref={knapp}
				variant="tertiary"
				size="small"
				icon={<ChatElipsisIcon title="Vis kommentar" />}
				onClick={() => setÅpen(!åpen)}
			/>
			<Popover open={åpen} onClose={() => setÅpen(false)} anchorEl={knapp.current}>
				<Popover.Content>
					<BodyShort size="small">{`Endret av ${reservasjon.endretAvNavn ?? 'ukjent'} ${dateTimeFormat(reservasjon.reservertFra)}`}</BodyShort>
					<BodyShort size="small">{reservasjon.kommentar}</BodyShort>
				</Popover.Content>
			</Popover>
		</>
	);
};

const ReservertOppgaveRad = ({
	oppgave,
	reservasjon,
	visModal,
}: {
	oppgave: GenerellOppgaveV3Dto;
	reservasjon: ReservasjonV3Dto;
	visModal: (modal: ReactNode) => void;
}) => {
	const { åpne } = useÅpneOppgave();
	const { forleng, isPending: forlenger } = useForlengReservasjon();
	const lukk = () => visModal(null);
	const id = oppgave.saksnummer ?? oppgave.journalpostId;

	return (
		<Table.Row>
			<Table.DataCell>
				{oppgave.oppgavebehandlingsUrl ? (
					<Link
						href={oppgave.oppgavebehandlingsUrl}
						onClick={(event) => {
							event.preventDefault();
							åpne(oppgave.oppgaveNøkkel, oppgave.oppgavebehandlingsUrl);
						}}
					>
						{`${oppgave.søkersNavn} ${oppgave.søkersPersonnr}`}
					</Link>
				) : (
					`${oppgave.søkersNavn} ${oppgave.søkersPersonnr}`
				)}
			</Table.DataCell>
			<Table.DataCell>{id}</Table.DataCell>
			<Table.DataCell>{visningsnavn(oppgave.behandlingstype)}</Table.DataCell>
			<Table.DataCell>{oppgave.opprettetTidspunkt ? dateFormat(oppgave.opprettetTidspunkt) : '–'}</Table.DataCell>
			<Table.DataCell>{dateTimeFormat(reservasjon.reservertTil)}</Table.DataCell>
			<Table.DataCell>
				<HStack gap="space-4" justify="end" wrap={false}>
					<Kommentar reservasjon={reservasjon} />
					<ActionMenu>
						<ActionMenu.Trigger>
							<Button
								variant="tertiary"
								size="small"
								icon={<MenuElipsisVerticalIcon title={`Handlinger for ${id ?? oppgave.søkersNavn}`} />}
							/>
						</ActionMenu.Trigger>
						<ActionMenu.Content>
							<ActionMenu.Item
								onSelect={() =>
									visModal(<OpphevReservasjonModal reservasjonsnøkler={[reservasjon.reservasjonsnøkkel]} lukk={lukk} />)
								}
							>
								Legg tilbake i felles kø
							</ActionMenu.Item>
							<ActionMenu.Item onSelect={() => forleng(reservasjon.reservasjonsnøkkel)} disabled={forlenger}>
								Forleng reservasjonen med 24 timer
							</ActionMenu.Item>
							<ActionMenu.Item
								onSelect={() => visModal(<FlyttReservasjonModal reservasjon={reservasjon} lukk={lukk} />)}
							>
								Endre eller flytt reservasjonen
							</ActionMenu.Item>
						</ActionMenu.Content>
					</ActionMenu>
				</HStack>
			</Table.DataCell>
		</Table.Row>
	);
};

const ReserverteOppgaver = () => {
	const { data: reservasjoner, isPending, isError } = useReserverteOppgaver();
	const [modal, setModal] = useState<ReactNode>(null);

	const rader = (reservasjoner ?? [])
		.toSorted((a, b) => a.reservertTil.localeCompare(b.reservertTil))
		.flatMap((reservasjon) =>
			reservasjon.reserverteV3Oppgaver
				.filter((oppgave) => oppgave.oppgavestatus === 'AAPEN')
				.map((oppgave) => ({ oppgave, reservasjon })),
		);

	return (
		<VStack gap="space-8">
			<HStack gap="space-8" align="center">
				<Heading level="3" size="xsmall">
					Reserverte oppgaver
				</Heading>
				{reservasjoner && (
					<Tag size="small" variant="neutral">
						{`${rader.length} reserverte`}
					</Tag>
				)}
			</HStack>
			{isPending && <Loader title="Henter reserverte oppgaver" />}
			{isError && <InlineMessage status="error">Kunne ikke hente reserverte oppgaver</InlineMessage>}
			{reservasjoner && rader.length === 0 && <BodyShort size="small">Du har ingen reserverte oppgaver</BodyShort>}
			{rader.length > 0 && (
				<Table size="small">
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell scope="col">Søker</Table.HeaderCell>
							<Table.HeaderCell scope="col">Id</Table.HeaderCell>
							<Table.HeaderCell scope="col">Behandlingstype</Table.HeaderCell>
							<Table.HeaderCell scope="col">Opprettet</Table.HeaderCell>
							<Table.HeaderCell scope="col">Reservert til</Table.HeaderCell>
							<Table.HeaderCell scope="col">
								<span className="sr-only">Handlinger</span>
							</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{rader.map(({ oppgave, reservasjon }) => (
							<ReservertOppgaveRad
								key={oppgave.oppgaveNøkkel.oppgaveEksternId}
								oppgave={oppgave}
								reservasjon={reservasjon}
								visModal={setModal}
							/>
						))}
					</Table.Body>
				</Table>
			)}
			{modal}
		</VStack>
	);
};

export default ReserverteOppgaver;
