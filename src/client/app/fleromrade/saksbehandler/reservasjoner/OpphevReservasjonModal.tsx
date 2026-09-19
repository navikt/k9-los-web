import { BodyShort, Button, InlineMessage, Modal, VStack } from '@navikt/ds-react';
import { useOpphevReservasjoner } from 'fleromrade/api/saksbehandlerQueries';

interface Props {
	reservasjonsnøkler: string[];
	/** Antall oppgaver som deler reservasjonen, når det bare er én reservasjon. */
	antallOppgaver?: number;
	lukk: () => void;
	onOpphevet?: () => void;
}

export const opphevReservasjonerTekst = (antallReservasjoner: number, antallOppgaver?: number) => {
	if (antallReservasjoner > 1) {
		return `Er du sikker på at du vil oppheve ${antallReservasjoner} reservasjoner?`;
	}
	if (antallOppgaver && antallOppgaver > 1) {
		return `Er du sikker på at du vil oppheve reservasjonen av ${antallOppgaver} oppgaver?`;
	}
	return 'Er du sikker på at du vil oppheve reservasjonen?';
};

const OpphevReservasjonModal = ({ reservasjonsnøkler, antallOppgaver, lukk, onOpphevet }: Props) => {
	const { opphev, isPending, isError } = useOpphevReservasjoner(onOpphevet);

	return (
		<Modal open onClose={lukk} header={{ heading: 'Legge oppgaven tilbake i felles kø?' }} width="small">
			<Modal.Body>
				<VStack gap="space-8">
					<BodyShort>{opphevReservasjonerTekst(reservasjonsnøkler.length, antallOppgaver)}</BodyShort>
					{isError && <InlineMessage status="error">Kunne ikke oppheve reservasjonen. Prøv igjen.</InlineMessage>}
				</VStack>
			</Modal.Body>
			<Modal.Footer>
				<Button loading={isPending} onClick={() => opphev(reservasjonsnøkler, { onSuccess: lukk })}>
					Opphev reservasjon
				</Button>
				<Button variant="secondary" onClick={lukk}>
					Avbryt
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default OpphevReservasjonModal;
