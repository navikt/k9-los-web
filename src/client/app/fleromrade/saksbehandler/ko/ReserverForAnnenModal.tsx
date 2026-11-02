import {
	BodyShort,
	Box,
	Button,
	Detail,
	Dialog,
	HStack,
	InlineMessage,
	Loader,
	UNSAFE_Combobox,
	VStack,
} from '@navikt/ds-react';
import type { OppgaveSammendragDto } from 'api/generated/los.schemas';
import {
	useReserverOppgaveForSaksbehandler,
	useSaksbehandlereForReservasjon,
} from 'fleromrade/api/saksbehandlerQueries';
import { type SubmitEvent, useId, useState } from 'react';

interface Props {
	oppgave: OppgaveSammendragDto;
	lukk: () => void;
}

const ReserverForAnnenModal = ({ oppgave, lukk }: Props) => {
	const { data: saksbehandlere, isPending, isError } = useSaksbehandlereForReservasjon();
	const { reserver, isPending: lagrer, isError: lagringFeilet } = useReserverOppgaveForSaksbehandler();
	const [åpen, setÅpen] = useState(true);
	const [navident, setNavident] = useState('');
	const [visValideringsfeil, setVisValideringsfeil] = useState(false);
	const skjemaId = useId();
	const valg = (saksbehandlere ?? [])
		.map(({ brukerIdent, navn }) => ({ value: brukerIdent, label: `${navn} (${brukerIdent})` }))
		.toSorted((a, b) => a.label.localeCompare(b.label));

	const idTittel = oppgave.saksnummer ? 'Sak' : 'Journalpost-id';
	const id = oppgave.saksnummer || oppgave.journalpostId;

	const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (lagrer) return;
		const saksbehandler = saksbehandlere?.find(({ brukerIdent }) => brukerIdent === navident);
		if (!saksbehandler) {
			setVisValideringsfeil(true);
			return;
		}
		reserver(oppgave.oppgaveNøkkel, navident, { onSuccess: () => setÅpen(false) });
	};

	return (
		<Dialog
			open={åpen}
			onOpenChange={(nyÅpen, event) => {
				if (!nyÅpen && lagrer) {
					event.preventDefault();
					return;
				}
				setÅpen(nyÅpen);
			}}
			onOpenChangeComplete={(nyÅpen) => {
				if (!nyÅpen) {
					lukk();
				}
			}}
		>
			<Dialog.Popup>
				<Dialog.Header>
					<Dialog.Title>Reserver oppgave for en annen saksbehandler</Dialog.Title>
				</Dialog.Header>
				<Dialog.Body>
					<form id={skjemaId} onSubmit={onSubmit}>
						<VStack gap="space-24">
							<Box background="neutral-soft" borderRadius="8" padding="space-16">
								<VStack gap="space-12">
									<div>
										<Detail textColor="subtle">Søker</Detail>
										<BodyShort weight="semibold">{oppgave.person?.navn ?? 'Ukjent'}</BodyShort>
										{oppgave.person?.fnr && <BodyShort size="small">{oppgave.person.fnr}</BodyShort>}
									</div>
									{id && (
										<div>
											<Detail textColor="subtle">{idTittel}</Detail>
											<BodyShort>{id}</BodyShort>
										</div>
									)}
								</VStack>
							</Box>
							{isPending && (
								<HStack justify="center">
									<Loader title="Henter saksbehandlere" />
								</HStack>
							)}
							{isError && (
								<InlineMessage status="error">Kunne ikke hente saksbehandlere. Lukk og prøv igjen.</InlineMessage>
							)}
							{saksbehandlere && (
								<UNSAFE_Combobox
									label="Saksbehandler"
									options={valg}
									selectedOptions={valg.filter(({ value }) => value === navident)}
									onToggleSelected={(verdi, valgt) => {
										setNavident(valgt ? verdi : '');
										setVisValideringsfeil(false);
									}}
									readOnly={lagrer}
									shouldAutocomplete
									error={visValideringsfeil ? 'Velg en saksbehandler fra lista' : undefined}
								/>
							)}
							{lagringFeilet && (
								<InlineMessage status="error" role="alert">
									Kunne ikke reservere oppgaven. Den kan ha blitt reservert av en annen, eller du mangler tilgang. Prøv
									igjen.
								</InlineMessage>
							)}
						</VStack>
					</form>
				</Dialog.Body>
				<Dialog.Footer>
					<Button type="submit" form={skjemaId} loading={lagrer} disabled={isPending || isError}>
						Reserver oppgave
					</Button>
					<Dialog.CloseTrigger>
						<Button type="button" variant="secondary" disabled={lagrer}>
							Avbryt
						</Button>
					</Dialog.CloseTrigger>
				</Dialog.Footer>
			</Dialog.Popup>
		</Dialog>
	);
};

export default ReserverForAnnenModal;
