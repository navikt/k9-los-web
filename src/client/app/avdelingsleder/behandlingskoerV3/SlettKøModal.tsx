import React from 'react';
import { BodyShort, Button, ErrorMessage, Heading, Modal } from '@navikt/ds-react';
import { useSlettKøMutation } from 'api/queries/avdelingslederQueries';

interface OwnProps {
	lukk: () => void;
	køTittel: string;
	id: string;
}

const SlettKøModal = ({ lukk, id, køTittel }: OwnProps) => {
	const { mutate, isPending, isError } = useSlettKøMutation(lukk);
	return (
		<Modal open onClose={lukk} portal>
			<Modal.Body>
				<Heading size="medium">Slett kø</Heading>
				<BodyShort>{`Er du sikker på at du vil slette ${køTittel}?`}</BodyShort>
				{isError && <ErrorMessage>Noe gikk galt ved oppretting av kø.</ErrorMessage>}
				<div className="mt-8 flex gap-4">
					<Button loading={isPending} onClick={() => mutate(id)}>
						Slett
					</Button>
					<Button variant="secondary" type="button" onClick={lukk}>
						Avbryt
					</Button>
				</div>
			</Modal.Body>
		</Modal>
	);
};

export default SlettKøModal;
