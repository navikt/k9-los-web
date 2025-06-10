import React, { FunctionComponent } from 'react';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { BodyLong, Button, Modal } from '@navikt/ds-react';
import { Oppgaveko } from '../oppgavekoTsType';

type TsProps = Readonly<{
	valgtOppgaveko: Oppgaveko;
	cancel: () => void;
	submit: (oppgaveko: Oppgaveko) => void;
}>;

/**
 * SletteOppgavekoModal
 * @deprecated
 *
 * Presentasjonskomponent. Modal som lar en avdelingsleder fjerne oppgavekøer.
 */

export const SletteOppgavekoModal: FunctionComponent<TsProps> = ({ valgtOppgaveko, cancel, submit }) => (
	<Modal
		header={{ heading: 'Ønsker du å slette oppgavekøen?', icon: <ExclamationmarkTriangleFillIcon /> }}
		onClose={cancel}
		open
	>
		<Modal.Body>
			<BodyLong>{`Er du sikker på at du vil slette ${valgtOppgaveko.navn}?`}</BodyLong>
		</Modal.Body>
		<Modal.Footer>
			<Button onClick={() => submit(valgtOppgaveko)}>Ja</Button>
			<Button variant="secondary" onClick={cancel}>
				Avbryt
			</Button>
		</Modal.Footer>
	</Modal>
);

export default SletteOppgavekoModal;
