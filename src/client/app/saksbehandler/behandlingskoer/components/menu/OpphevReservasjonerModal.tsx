import { BodyShort, Button, Modal } from '@navikt/ds-react';
import { useOpphevReservasjoner } from 'api/queries/saksbehandlerQueries';
import type { FunctionComponent } from 'react';

type OwnProps = Readonly<{
	open: boolean;
	reservasjonsnøkler: Array<string>;
	antallOppgaver?: number;
	closeModal: () => void;
	onReservasjonOpphevet?: () => void;
}>;

export const opphevReservasjonerTekst = (antallReservasjoner: number, antallOppgaver?: number) => {
	if (antallReservasjoner > 1) {
		return `Er du sikker på at du vil oppheve ${antallReservasjoner} reservasjoner?`;
	}
	if (antallOppgaver && antallOppgaver > 1) {
		return `Er du sikker på at du vil oppheve reservasjonen av ${antallOppgaver} oppgaver?`;
	}
	return 'Er du sikker på at du vil oppheve reservasjonen?';
};

export const OpphevReservasjonerModal: FunctionComponent<OwnProps> = ({
	open,
	closeModal,
	reservasjonsnøkler,
	antallOppgaver,
	onReservasjonOpphevet,
}) => {
	const { mutate: opphevReservasjoner } = useOpphevReservasjoner(onReservasjonOpphevet);

	const antall = reservasjonsnøkler.length;

	return (
		<Modal
			open={open}
			header={{
				heading: 'Oppheve reservasjon?',
			}}
			onClose={closeModal}
		>
			<Modal.Body>
				<BodyShort>{opphevReservasjonerTekst(antall, antallOppgaver)}</BodyShort>
			</Modal.Body>
			<Modal.Footer>
				<Button
					onClick={() =>
						opphevReservasjoner(
							reservasjonsnøkler.map((reservasjonsnøkkel) => ({
								reservasjonsnøkkel,
							})),
							{ onSuccess: closeModal },
						)
					}
				>
					OK
				</Button>
				<Button variant="secondary" type="button" onClick={closeModal}>
					Avbryt
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default OpphevReservasjonerModal;
