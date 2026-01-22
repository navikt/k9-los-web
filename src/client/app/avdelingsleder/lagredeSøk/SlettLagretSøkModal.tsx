import React from 'react';
import { BodyShort, Button, Heading, Modal } from '@navikt/ds-react';
import { LagretSøk, useSlettLagretSøk, useSlettUttrekkForLagretSøk } from 'api/queries/avdelingslederQueries';
import { RenderModalProps } from 'sharedComponents/ModalButton';

interface SlettLagretSøkModalProps extends RenderModalProps {
	lagretSøk: LagretSøk;
	antallUttrekk: number;
}

export function SlettLagretSøkModal({ lagretSøk, antallUttrekk, open, closeModal }: SlettLagretSøkModalProps) {
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
		<Modal open={open} onClose={closeModal} aria-label="Slett lagret søk">
			<Modal.Header>
				<Heading size="medium">Slett lagret søk</Heading>
			</Modal.Header>
			<Modal.Body>
				<BodyShort>
					Dette lagrede søket har {antallUttrekk} tilknyttede uttrekk. Hva ønsker du å gjøre?
				</BodyShort>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="danger" onClick={handleSlettMedUttrekk} loading={isPending}>
					Slett søk og uttrekk
				</Button>
				<Button variant="secondary" onClick={handleSlettUtenUttrekk} loading={isPending}>
					Slett søk, behold uttrekk
				</Button>
				<Button variant="tertiary" onClick={closeModal} disabled={isPending}>
					Avbryt
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
