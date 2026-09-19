import {
	BodyShort,
	Button,
	DatePicker,
	InlineMessage,
	Modal,
	Skeleton,
	TextField,
	UNSAFE_Combobox,
	useDatepicker,
	VStack,
} from '@navikt/ds-react';
import type { ReservasjonV3Dto } from 'api/generated/los.schemas';
import dayjs from 'dayjs';
import { useEndreReservasjoner, useSaksbehandlereForReservasjon } from 'fleromrade/api/saksbehandlerQueries';
import { type SubmitEvent, useState } from 'react';

interface Props {
	reservasjon: ReservasjonV3Dto;
	/** Antall oppgaver som deler reservasjonen. */
	antallOppgaver?: number;
	lukk: () => void;
	onEndret?: () => void;
}

export const antallOppgaverTekst = (antallOppgaver?: number) =>
	antallOppgaver && antallOppgaver > 1 ? `Reservasjonen gjelder ${antallOppgaver} oppgaver.` : null;

interface Feil {
	saksbehandler?: string;
	dato?: string;
	begrunnelse?: string;
}

const FlyttReservasjonModal = ({ reservasjon, antallOppgaver, lukk, onEndret }: Props) => {
	const { data: saksbehandlere, isPending: henterSaksbehandlere, isError } = useSaksbehandlereForReservasjon();
	const { endre, isPending: lagrer, isError: lagringFeilet } = useEndreReservasjoner(onEndret);
	const oppgaveantallTekst = antallOppgaverTekst(antallOppgaver);
	const [brukerIdent, setBrukerIdent] = useState(reservasjon.reservertAvIdent ?? '');
	const [reserverTil, setReserverTil] = useState<Date | undefined>(dayjs(reservasjon.reservertTil).toDate());
	const [begrunnelse, setBegrunnelse] = useState(reservasjon.kommentar ?? '');
	const [feil, setFeil] = useState<Feil>({});

	const { datepickerProps, inputProps } = useDatepicker({
		fromDate: new Date(),
		defaultSelected: reserverTil,
		onDateChange: setReserverTil,
	});

	const valg = (saksbehandlere ?? [])
		.map((saksbehandler) => ({ value: saksbehandler.brukerIdent, label: saksbehandler.navn }))
		.toSorted((a, b) => a.label.localeCompare(b.label));

	const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();
		const nyeFeil: Feil = {
			saksbehandler: brukerIdent ? undefined : 'Velg en saksbehandler',
			dato: reserverTil ? undefined : 'Velg en gyldig dato fra og med i dag',
			begrunnelse:
				begrunnelse.trim().length < 3 || begrunnelse.length > 1500
					? 'Begrunnelsen må være mellom 3 og 1500 tegn'
					: undefined,
		};
		setFeil(nyeFeil);
		if (Object.values(nyeFeil).some(Boolean)) {
			return;
		}
		endre(
			[
				{
					reservasjonsnøkkel: reservasjon.reservasjonsnøkkel,
					brukerIdent,
					begrunnelse: begrunnelse.trim(),
					reserverTil: dayjs(reserverTil).format('YYYY-MM-DD'),
				},
			],
			{ onSuccess: lukk },
		);
	};

	return (
		<Modal open onClose={lukk} header={{ heading: 'Endre reservasjon' }} width="medium">
			<form onSubmit={onSubmit}>
				<Modal.Body>
					<VStack gap="space-24">
						{oppgaveantallTekst && <BodyShort>{oppgaveantallTekst}</BodyShort>}
						{henterSaksbehandlere && <Skeleton height={80} />}
						{isError && <InlineMessage status="error">Kunne ikke hente saksbehandlere</InlineMessage>}
						{saksbehandlere && (
							<UNSAFE_Combobox
								label="Saksbehandler"
								options={valg}
								selectedOptions={valg.filter((v) => v.value === brukerIdent)}
								onToggleSelected={(verdi, valgt) => setBrukerIdent(valgt ? verdi : '')}
								shouldAutocomplete
								error={feil.saksbehandler}
							/>
						)}
						<DatePicker {...datepickerProps}>
							<DatePicker.Input {...inputProps} label="Reservert til og med" error={feil.dato} />
						</DatePicker>
						<TextField
							label="Begrunnelse"
							value={begrunnelse}
							onChange={(event) => setBegrunnelse(event.target.value)}
							error={feil.begrunnelse}
						/>
						{lagringFeilet && <InlineMessage status="error">Kunne ikke endre reservasjonen. Prøv igjen.</InlineMessage>}
					</VStack>
				</Modal.Body>
				<Modal.Footer>
					<Button type="submit" loading={lagrer}>
						Lagre
					</Button>
					<Button type="button" variant="secondary" onClick={lukk}>
						Avbryt
					</Button>
				</Modal.Footer>
			</form>
		</Modal>
	);
};

export default FlyttReservasjonModal;
