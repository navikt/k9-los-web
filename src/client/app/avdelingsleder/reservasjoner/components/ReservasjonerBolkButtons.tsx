import ModalButton from 'sharedComponents/ModalButton';
import { Button } from '@navikt/ds-react';
import OpphevReservasjonerModal from 'saksbehandler/behandlingskoer/components/menu/OpphevReservasjonerModal';
import React from 'react';
import { OppgaveNøkkel } from 'types/OppgaveNøkkel';
import FlyttReservasjonerModal from 'saksbehandler/behandlingskoer/components/menu/FlyttReservasjonerModal';

interface Props {
	valgteReservasjoner: Array<{ oppgaveNøkkel: OppgaveNøkkel; begrunnelse: string }>;
}

const ReservasjonerBolkButtons = ({ valgteReservasjoner }: Props) => (
	<div className="flex gap-4">
		<ModalButton
			renderButton={({ openModal }) => (
				<Button onClick={openModal} variant="secondary" size="small">
					Legg oppgaver tilbake i felles kø
				</Button>
			)}
			renderModal={({ closeModal, open }) => (
				<OpphevReservasjonerModal
					oppgaveNøkler={valgteReservasjoner.map((r) => r.oppgaveNøkkel)}
					open={open}
					closeModal={closeModal}
				/>
			)}
		/>
		<ModalButton
			renderButton={({ openModal }) => (
				<Button onClick={openModal} variant="secondary" size="small">
					Flytt reservasjonen til annen saksbehandler
				</Button>
			)}
			renderModal={({ closeModal, open }) => (
				<FlyttReservasjonerModal reservasjoner={valgteReservasjoner} open={open} closeModal={closeModal} />
			)}
		/>
	</div>
);

export default ReservasjonerBolkButtons;
