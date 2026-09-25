import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { Button, Modal } from '@navikt/ds-react';
import { useState } from 'react';
import { useIdleTimer } from 'react-idle-timer';

const timeout = 1000 * 60 * 58;

const SesjonUtløptModal = () => {
	const [sesjonHarUtløpt, setSesjonHarUtløpt] = useState(false);

	useIdleTimer({
		timeout,
		onIdle: () => setSesjonHarUtløpt(true),
	});

	if (!sesjonHarUtløpt) {
		return null;
	}

	return (
		<Modal
			className="min-w-[500px]"
			open
			onClose={() => window.location.reload()}
			header={{ heading: 'Sesjonen er utløpt', icon: <ExclamationmarkTriangleIcon />, closeButton: false }}
		>
			<Modal.Body>
				Økten din har utløpt etter en periode med inaktivitet. Vennligst logg inn på nytt for å fortsette.
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={() => window.location.reload()}>Logg inn på nytt</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default SesjonUtløptModal;
