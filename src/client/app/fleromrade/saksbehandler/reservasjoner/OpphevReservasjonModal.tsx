import { BodyShort, Button, InlineMessage, Modal, VStack } from '@navikt/ds-react';
import { useOpphevReservasjoner } from 'fleromrade/api/saksbehandlerQueries';

interface Props {
	reservasjonsnøkler: string[];
	lukk: () => void;
}

const OpphevReservasjonModal = ({ reservasjonsnøkler, lukk }: Props) => {
	const { opphev, isPending, isError } = useOpphevReservasjoner();
	const antall = reservasjonsnøkler.length;

	return (
		<Modal open onClose={lukk} header={{ heading: 'Legge oppgaven tilbake i felles kø?' }} width="small">
			<Modal.Body>
				<VStack gap="space-8">
					<BodyShort>
						{antall > 1
							? `Er du sikker på at du vil oppheve ${antall} reservasjoner?`
							: 'Er du sikker på at du vil oppheve reservasjonen?'}
					</BodyShort>
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
