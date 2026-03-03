import React, { useState } from 'react';
import { FilesIcon } from '@navikt/aksel-icons';
import { Alert, Button, Dialog, TextField } from '@navikt/ds-react';
import { LagretSøk, useKopierLagretSøk } from 'api/queries/avdelingslederQueries';

interface Props {
	lagretSøk: LagretSøk;
	onNyOpprettet: (id: number) => void;
}

export function KopierLagretSøkDialog({ lagretSøk, onNyOpprettet }: Props) {
	const [open, setOpen] = useState(false);
	const [tittel, setTittel] = useState('');
	const {
		mutate: kopierLagretSøk,
		isPending,
		isError,
	} = useKopierLagretSøk((id) => {
		setOpen(false);
		setTittel('');
		onNyOpprettet(id);
	});

	const harTittel = lagretSøk.tittel.length > 0;

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<Dialog.Trigger>
				<Button variant="tertiary" size="small" icon={<FilesIcon />}>
					Kopier
				</Button>
			</Dialog.Trigger>
			<Dialog.Popup width="small">
				<Dialog.Header>
					<Dialog.Title>{harTittel ? `Kopier lagret søk '${lagretSøk.tittel}'` : 'Kopier lagret søk'}</Dialog.Title>
				</Dialog.Header>
				<Dialog.Body>
					<TextField
						label="Tittel på kopi"
						value={tittel}
						onChange={(e) => setTittel(e.target.value)}
						size="small"
						maxLength={100}
						autoFocus
					/>
					{isError && (
						<Alert variant="error" className="mt-4">
							Kunne ikke kopiere søket. Prøv igjen.
						</Alert>
					)}
				</Dialog.Body>
				<Dialog.Footer>
					<Button type="button" loading={isPending} onClick={() => kopierLagretSøk({ id: lagretSøk.id, tittel })}>
						Opprett kopi
					</Button>
					<Dialog.CloseTrigger>
						<Button variant="secondary" type="button" disabled={isPending}>
							Avbryt
						</Button>
					</Dialog.CloseTrigger>
				</Dialog.Footer>
			</Dialog.Popup>
		</Dialog>
	);
}
