import React, { FunctionComponent } from 'react';
import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { Button, Modal } from '@navikt/ds-react';
import { Driftsmelding } from './driftsmeldingTsType';

type TsProps = Readonly<{
	valgtDriftsmelding: Driftsmelding;
	closeSletteModal: () => void;
	fjernDriftsmelding: (driftsmelding: Driftsmelding) => void;
}>;

/**
 * SletteDriftsmeldingModal
 *
 * Presentasjonskomponent. Modal som lar en avdelingsleder fjerne tilgjengelige saksbehandlere.
 */
const SletteDriftsmeldingModal: FunctionComponent<TsProps> = ({
	valgtDriftsmelding,
	closeSletteModal,
	fjernDriftsmelding,
}: TsProps) => (
	<Modal
		open
		onClose={closeSletteModal}
		header={{
			heading: 'Slette driftmelding',
			closeButton: false,
			icon: <ExclamationmarkTriangleIcon />,
		}}
	>
		<Modal.Body>Ønsker du å slette driftmelding?</Modal.Body>
		<Modal.Footer>
			<Button variant="primary" onClick={() => fjernDriftsmelding(valgtDriftsmelding)} autoFocus>
				Ja
			</Button>
			<Button variant="secondary" onClick={closeSletteModal}>
				Nei
			</Button>
		</Modal.Footer>
	</Modal>
);

export default SletteDriftsmeldingModal;
