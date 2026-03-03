import React, { useState } from 'react';
import { TrashIcon } from '@navikt/aksel-icons';
import { Button, Dialog } from '@navikt/ds-react';
import { LagretSøk, useSlettLagretSøk, useSlettUttrekkForLagretSøk } from 'api/queries/avdelingslederQueries';

interface SlettLagretSøkDialogProps {
	lagretSøk: LagretSøk;
	antallUttrekk: number;
}

export function SlettLagretSøkDialog({ lagretSøk, antallUttrekk }: SlettLagretSøkDialogProps) {
	const [open, setOpen] = useState(false);
	const closeModal = () => setOpen(false);
	const { mutate: slettLagretSøk, isPending: slettLagretSøkPending } = useSlettLagretSøk(closeModal);
	const { mutate: slettUttrekkForLagretSøk, isPending: slettUttrekkPending } = useSlettUttrekkForLagretSøk();

	const isPending = slettLagretSøkPending || slettUttrekkPending;

	const handleSlettMedUttrekk = () => {
		slettUttrekkForLagretSøk(lagretSøk.id, {
			onSuccess: () => {
				slettLagretSøk(lagretSøk.id);
			},
		});
	};

	const handleSlettUtenUttrekk = () => {
		slettLagretSøk(lagretSøk.id);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<Dialog.Trigger>
				<Button variant="tertiary" size="small" icon={<TrashIcon />}>
					Slett
				</Button>
			</Dialog.Trigger>
			<Dialog.Popup width="medium">
				<Dialog.Header>
					<Dialog.Title>Slett lagret søk</Dialog.Title>
				</Dialog.Header>
				<Dialog.Body>Dette lagrede søket har {antallUttrekk} tilknyttede uttrekk. Hva ønsker du å gjøre?</Dialog.Body>
				<Dialog.Footer>
					<Button data-color="danger" variant="primary" onClick={handleSlettMedUttrekk} loading={isPending}>
						Slett søk og uttrekk
					</Button>
					<Button variant="secondary" onClick={handleSlettUtenUttrekk} loading={isPending}>
						Slett søk, behold uttrekk
					</Button>
					<Dialog.CloseTrigger>
						<Button variant="tertiary" disabled={isPending}>
							Avbryt
						</Button>
					</Dialog.CloseTrigger>
				</Dialog.Footer>
			</Dialog.Popup>
		</Dialog>
	);
}
