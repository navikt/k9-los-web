import KopierbarVerdi, { Kopieringsområde } from 'sharedComponents/KopierbarVerdi';
import { ChatElipsisIcon, MenuElipsisVerticalIcon } from '@navikt/aksel-icons';
import {
	ActionMenu,
	BodyShort,
	Button,
	Chips,
	Detail,
	HStack,
	InlineMessage,
	Loader,
	Popover,
	Table,
	VStack,
} from '@navikt/ds-react';
import type { GenerellOppgaveV3Dto, ReservasjonV3Dto } from 'api/generated/los.schemas';
import { useForlengReservasjon, useReserverteOppgaver, useÅpneOppgave } from 'fleromrade/api/saksbehandlerQueries';
import { type ReactNode, useId, useRef, useState } from 'react';
import { idKolonneTittel } from 'saksbehandler/tabellvisning';
import { dateFormat, getDateAndTime } from 'utils/dateUtils';
import SammenleggbarOverskrift from '../SammenleggbarOverskrift';
import { visningsnavn } from '../visningsnavn';
import FlyttReservasjonModal from './FlyttReservasjonModal';
import OpphevReservasjonModal from './OpphevReservasjonModal';
import { RAD_NØKKEL_ATTRIBUTT, useRadFlyttAnimasjon } from './radFlyttAnimasjon';
import styles from './reserverteOppgaver.module.css';
import {
	filtrerOppgaverEtterStatus,
	nøkkelStreng,
	sorterOppgaverIReservasjon,
	sorterReservasjoner,
} from './reserverteOppgaverSortering';

/*
 * Reserverte oppgaver, slik de vises i legacy-K9 på feature/reservasjon-sortering: oppgavene grupperes per
 * reservasjon, reservasjonen som utløper først står øverst, og radene glir på plass etter en handling.
 */

const Kommentar = ({ reservasjon }: { reservasjon: ReservasjonV3Dto }) => {
	const knapp = useRef<HTMLButtonElement>(null);
	const [åpen, setÅpen] = useState(false);
	const popoverId = useId();

	if (!reservasjon.kommentar) {
		return null;
	}

	const { date, time } = getDateAndTime(reservasjon.reservertFra);

	return (
		<>
			<Button
				ref={knapp}
				className="p-1"
				variant="tertiary"
				size="medium"
				icon={<ChatElipsisIcon title="Vis kommentar for reservasjonen" />}
				onClick={() => setÅpen(!åpen)}
				aria-expanded={åpen}
				aria-controls={åpen ? popoverId : undefined}
				data-marker-reservasjonsgruppe
			/>
			<Popover id={popoverId} open={åpen} onClose={() => setÅpen(false)} anchorEl={knapp.current}>
				<Popover.Content>
					<BodyShort size="small">{`Reservasjon endret av ${reservasjon.endretAvNavn || 'Ukjent'}`}</BodyShort>
					<BodyShort size="small" spacing>{`${date} ${time}`}</BodyShort>
					<BodyShort size="small">{reservasjon.kommentar}</BodyShort>
				</Popover.Content>
			</Popover>
		</>
	);
};

interface RadProps {
	oppgave: GenerellOppgaveV3Dto;
	reservasjon: ReservasjonV3Dto;
	/** Antall viste oppgaver som deler denne reservasjonen. */
	antallOppgaverIReservasjonen: number;
	/** Kalles når en handling i menyen er lagret, slik at radene som flytter seg, animeres. */
	onHandlingLagret: () => void;
}

const ReservertOppgaveRad = ({ oppgave, reservasjon, antallOppgaverIReservasjonen, onHandlingLagret }: RadProps) => {
	const [modal, setModal] = useState<ReactNode>(null);
	const { åpne } = useÅpneOppgave();
	const { forleng, isPending: forlenger } = useForlengReservasjon(onHandlingLagret);
	const lukk = () => setModal(null);

	const flereOppgaver = antallOppgaverIReservasjonen > 1;
	const handlingerBeskrivelse = flereOppgaver
		? `Handlinger på reservasjonen med ${antallOppgaverIReservasjonen} oppgaver`
		: 'Handlinger på reservasjonen';
	const id = oppgave.saksnummer || oppgave.journalpostId;
	const idNavn = oppgave.saksnummer ? 'saksnummer' : 'journalpost-id';
	const ytelse = visningsnavn(oppgave.ytelsestype);

	return (
		<Table.Row {...{ [RAD_NØKKEL_ATTRIBUTT]: nøkkelStreng(oppgave.oppgaveNøkkel) }}>
			<Kopieringsområde>
				<Table.DataCell>
					{oppgave.søkersNavn}
					<br />
					<KopierbarVerdi copyText={oppgave.søkersPersonnr} title="Kopier fødselsnummer">
						<Detail>{oppgave.søkersPersonnr}</Detail>
					</KopierbarVerdi>
				</Table.DataCell>
			</Kopieringsområde>
			<Kopieringsområde>
				<Table.DataCell>
					<KopierbarVerdi copyText={id} title={`Kopier ${idNavn}`}>
						{id}
					</KopierbarVerdi>
					{oppgave.oppgavestatus === 'VENTER' && (
						<>
							<br />
							<Detail>På vent</Detail>
						</>
					)}
				</Table.DataCell>
			</Kopieringsområde>
			<Table.DataCell>
				{visningsnavn(oppgave.behandlingstype)}
				{ytelse && (
					<>
						<br />
						<Detail>{ytelse}</Detail>
					</>
				)}
			</Table.DataCell>
			<Table.DataCell>{oppgave.opprettetTidspunkt && dateFormat(oppgave.opprettetTidspunkt)}</Table.DataCell>
			<Table.DataCell>
				<HStack gap="space-12" align="center" wrap={false}>
					{dateFormat(reservasjon.reservertTil)}
					<Kommentar reservasjon={reservasjon} />
				</HStack>
			</Table.DataCell>
			<Table.DataCell>
				<HStack gap="space-12" align="center" wrap={false}>
					<Button
						variant="secondary"
						size="small"
						disabled={!oppgave.oppgavebehandlingsUrl}
						onClick={() => åpne(oppgave.oppgaveNøkkel, oppgave.oppgavebehandlingsUrl)}
					>
						Åpne
					</Button>
					{modal}
					<ActionMenu>
						<ActionMenu.Trigger>
							<Button
								variant="secondary"
								className="p-1"
								size="medium"
								icon={<MenuElipsisVerticalIcon title={handlingerBeskrivelse} />}
								data-marker-reservasjonsgruppe
							/>
						</ActionMenu.Trigger>
						<ActionMenu.Content>
							<ActionMenu.Group aria-label={handlingerBeskrivelse}>
								<ActionMenu.Item
									onSelect={() =>
										setModal(
											<OpphevReservasjonModal
												reservasjonsnøkler={[reservasjon.reservasjonsnøkkel]}
												antallOppgaver={antallOppgaverIReservasjonen}
												lukk={lukk}
												onOpphevet={onHandlingLagret}
											/>,
										)
									}
								>
									{flereOppgaver ? 'Legg oppgavene' : 'Legg oppgave'} <br />
									tilbake i felles kø
								</ActionMenu.Item>
								<ActionMenu.Divider />
								<ActionMenu.Item onSelect={() => forleng(reservasjon.reservasjonsnøkkel)} disabled={forlenger}>
									Forleng din reservasjon av
									<br /> {flereOppgaver ? 'oppgavene' : 'oppgaven'} med 24 timer
								</ActionMenu.Item>
								<ActionMenu.Divider />
								<ActionMenu.Item
									onSelect={() =>
										setModal(
											<FlyttReservasjonModal
												reservasjon={reservasjon}
												antallOppgaver={antallOppgaverIReservasjonen}
												lukk={lukk}
												onEndret={onHandlingLagret}
											/>,
										)
									}
								>
									Endre og/eller flytte reservasjon
								</ActionMenu.Item>
							</ActionMenu.Group>
						</ActionMenu.Content>
					</ActionMenu>
				</HStack>
			</Table.DataCell>
		</Table.Row>
	);
};

const ReserverteOppgaver = () => {
	const [visReservasjoner, setVisReservasjoner] = useState(true);
	const [visÅpne, setVisÅpne] = useState(true);
	const [visPåVent, setVisPåVent] = useState(false);
	const tabellRef = useRef<HTMLTableElement>(null);
	const handlingVenter = useRef(false);
	const innholdId = useId();

	const { data: reservasjoner, dataUpdatedAt, isPending, isSuccess, isError } = useReserverteOppgaver();

	const alleOppgaver = (reservasjoner ?? []).flatMap((reservasjon) => reservasjon.reserverteV3Oppgaver);
	const antallÅpne = alleOppgaver.filter((oppgave) => oppgave.oppgavestatus === 'AAPEN').length;
	const antallPåVent = alleOppgaver.filter((oppgave) => oppgave.oppgavestatus === 'VENTER').length;

	// Én gruppe per reservasjon. Oppgavene i gruppen deler reservasjonsnøkkel, så handlingene gjelder hele gruppen.
	const reservasjonsgrupper = sorterReservasjoner(reservasjoner ?? [])
		.map((reservasjon) => ({
			reservasjon,
			oppgaver: sorterOppgaverIReservasjon(
				filtrerOppgaverEtterStatus(reservasjon.reserverteV3Oppgaver, visÅpne, visPåVent),
			),
		}))
		.filter((gruppe) => gruppe.oppgaver.length > 0);

	const visteOppgaver = reservasjonsgrupper.flatMap((gruppe) => gruppe.oppgaver);

	useRadFlyttAnimasjon(
		tabellRef,
		visteOppgaver.map((oppgave) => nøkkelStreng(oppgave.oppgaveNøkkel)).join(),
		dataUpdatedAt,
		handlingVenter,
	);

	return (
		<VStack gap="space-8">
			<HStack gap="space-8" align="center">
				<SammenleggbarOverskrift
					tittel="Reserverte oppgaver"
					åpen={visReservasjoner}
					onToggle={() => setVisReservasjoner(!visReservasjoner)}
					innholdId={innholdId}
				/>
				{visReservasjoner && isSuccess && (antallÅpne > 0 || antallPåVent > 0) && (
					<Chips size="medium" data-color="neutral">
						<Chips.Toggle selected={visÅpne} onClick={() => setVisÅpne((vis) => !vis)}>
							{`${antallÅpne} åpne`}
						</Chips.Toggle>
						{antallPåVent > 0 && (
							<Chips.Toggle selected={visPåVent} onClick={() => setVisPåVent((vis) => !vis)}>
								{`${antallPåVent} på vent`}
							</Chips.Toggle>
						)}
					</Chips>
				)}
			</HStack>
			<div id={innholdId}>
				{visReservasjoner && (
					<>
						{isPending && <Loader title="Henter reserverte oppgaver" />}
						{isError && <InlineMessage status="error">Noe gikk galt ved lasting av reservasjoner</InlineMessage>}
						{isSuccess && visteOppgaver.length === 0 && (
							<BodyShort size="small">Det er ingen reserverte oppgaver</BodyShort>
						)}
						{visteOppgaver.length > 0 && (
							<Table ref={tabellRef}>
								<Table.Header>
									<Table.Row>
										<Table.HeaderCell scope="col">Søker</Table.HeaderCell>
										<Table.HeaderCell scope="col">{idKolonneTittel(visteOppgaver)}</Table.HeaderCell>
										<Table.HeaderCell scope="col">Behandlingstype</Table.HeaderCell>
										<Table.HeaderCell scope="col">Oppgave opprettet</Table.HeaderCell>
										<Table.HeaderCell scope="col">Reservert t.o.m.</Table.HeaderCell>
										<Table.HeaderCell scope="col">Handlinger</Table.HeaderCell>
									</Table.Row>
								</Table.Header>
								{reservasjonsgrupper.map(({ reservasjon, oppgaver }) => (
									<Table.Body key={reservasjon.reservasjonsnøkkel} className={styles.reservasjonsgruppe}>
										{oppgaver.map((oppgave) => (
											<ReservertOppgaveRad
												key={nøkkelStreng(oppgave.oppgaveNøkkel)}
												oppgave={oppgave}
												reservasjon={reservasjon}
												antallOppgaverIReservasjonen={oppgaver.length}
												onHandlingLagret={() => {
													handlingVenter.current = true;
												}}
											/>
										))}
									</Table.Body>
								))}
							</Table>
						)}
					</>
				)}
			</div>
		</VStack>
	);
};

export default ReserverteOppgaver;
