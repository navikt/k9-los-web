import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { BodyLong, Button, Modal } from '@navikt/ds-react';
import type { FunctionComponent } from 'react';
import type { Saksbehandler } from '../saksbehandlerTsType';

type OwnProps = Readonly<{
	valgtSaksbehandler: Saksbehandler;
	closeSletteModal: () => void;
	slettSaksbehandler: (epost: string) => void;
	loading: boolean;
}>;

/**
 * SletteSaksbehandlerModal
 *
 * Presentasjonskomponent. Modal som lar en avdelingsleder fjerne tilgjengelige saksbehandlere.
 */
const SletteSaksbehandlerModal: FunctionComponent<OwnProps> = ({
	valgtSaksbehandler,
	closeSletteModal,
	slettSaksbehandler,
	loading,
}) => (
	<Modal
		header={{ heading: 'Ønsker du å slette saksbehandler?', icon: <ExclamationmarkTriangleIcon /> }}
		onClose={closeSletteModal}
		className="min-w-[500px]"
		open
	>
		<Modal.Body>
			<BodyLong>
				{`Er du sikker på at du vil slette ${
					valgtSaksbehandler.navn || valgtSaksbehandler.epost
				}? Saksbehandleren kan fortsatt logge inn i K9Los og søke opp oppgaver, men vil ikke kunne reservere oppgaver eller legges til i køer.`}
			</BodyLong>
		</Modal.Body>
		<Modal.Footer>
			<Button onClick={() => slettSaksbehandler(valgtSaksbehandler.epost)} loading={loading}>
				Ja
			</Button>
			<Button variant="secondary" onClick={closeSletteModal}>
				Nei
			</Button>
		</Modal.Footer>
	</Modal>
);

export default SletteSaksbehandlerModal;
