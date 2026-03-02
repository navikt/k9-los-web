import React, { useState } from 'react';
import { Alert, Button, Modal, TextField } from '@navikt/ds-react';
import { LagretSøk, useKopierLagretSøk } from 'api/queries/avdelingslederQueries';
import { RenderModalProps } from 'sharedComponents/ModalButton';

type Props = RenderModalProps & {
	lagretSøk: LagretSøk;
	onNyOpprettet: (id: number) => void;
};

export function KopierLagretSøkModal({ lagretSøk, onNyOpprettet, open, closeModal }: Props) {
	const [tittel, setTittel] = useState('');
	const { mutate: kopierLagretSøk, isPending, isError } = useKopierLagretSøk((id) => {
		closeModal();
		onNyOpprettet(id);
	});

	const kildeTittel = lagretSøk.tittel.length > 0 ? `'${lagretSøk.tittel}'` : '(ingen tittel)';

	return (
		<Modal open={open} onClose={closeModal} aria-label="Kopier lagret søk" className="w-[32rem]">
			<Modal.Header>Kopier lagret søk</Modal.Header>
			<Modal.Body className="flex flex-col gap-4">
				<p className="m-0">Lag kopi av lagret søk med tittel {kildeTittel}.</p>
				<TextField
					label="Tittel på kopi"
					value={tittel}
					onChange={(e) => setTittel(e.target.value)}
					size="small"
					htmlSize={40}
					maxLength={100}
					autoFocus
				/>
				{isError && (
					<Alert variant="error">Kunne ikke kopiere søket. Prøv igjen.</Alert>
				)}
			</Modal.Body>
			<Modal.Footer>
				<Button
					type="button"
					loading={isPending}
					onClick={() => kopierLagretSøk({ id: lagretSøk.id, tittel })}
				>
					Opprett kopi
				</Button>
				<Button variant="secondary" type="button" onClick={closeModal} disabled={isPending}>
					Avbryt
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
