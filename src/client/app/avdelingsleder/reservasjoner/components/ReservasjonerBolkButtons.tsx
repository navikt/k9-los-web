import React from 'react';
import { Button } from '@navikt/ds-react';
import FlyttReservasjonerModal from 'saksbehandler/behandlingskoer/components/menu/FlyttReservasjonerModal';
import OpphevReservasjonerModal from 'saksbehandler/behandlingskoer/components/menu/OpphevReservasjonerModal';
import ModalButton from 'sharedComponents/ModalButton';

interface Props {
	valgteReservasjoner: Array<{ reservasjonsnøkkel: string; begrunnelse: string }>;
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
					reservasjonsnøkler={valgteReservasjoner.map((r) => r.reservasjonsnøkkel)}
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
