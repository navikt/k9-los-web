import { ApmErrorBoundary } from '@nais/apm/react';
import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { Alert, Button, Modal } from '@navikt/ds-react';
import { type FunctionComponent, useState } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import '../../styles/global.css';
import HeaderWithErrorPanel from './components/HeaderWithErrorPanel';
import Home from './components/Home';
import InnloggetSaksbehandlerResolver from './InnloggetSaksbehandlerResolver';

/**
 * AppIndex
 *
 * Container komponent. Dette er toppkomponenten i applikasjonen. Denne vil rendre header
 * og home-komponentene. Home-komponenten vil rendre barn-komponenter via ruter.
 * Komponenten er også ansvarlig for å hente innlogget NAV-ansatt, rettskilde-url,
 * og kodeverk fra server og lagre desse i klientens state.
 */

const AppIndex: FunctionComponent = () => {
	const [sessionHarUtlopt, setSessionHarUtlopt] = useState<boolean>(false);

	const timeout = 1000 * 60 * 58;

	const handleOnIdle = (): void => {
		setSessionHarUtlopt(true);
	};

	useIdleTimer({
		timeout,
		onIdle: handleOnIdle,
	});

	return (
		// To nivåer med vilje: den indre grensen lar header og sesjonsmodal overleve
		// en krasj i sideinnholdet, mens den ytre fanger og rapporterer feil i
		// resolveren og headeren – som ellers ikke ville nådd noen boundary.
		<ApmErrorBoundary
			fingerprint="app-root"
			fallback={
				<div className="m-5">
					<Alert variant="error">Det oppstod en teknisk feil. Last siden på nytt.</Alert>
				</div>
			}
		>
			<InnloggetSaksbehandlerResolver>
				<HeaderWithErrorPanel />
				{sessionHarUtlopt && (
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
				)}
				<ApmErrorBoundary
					fingerprint="app-innhold"
					fallback={
						<Alert variant="error" className="mt-5">
							Det oppstod en teknisk feil. Last siden på nytt.
						</Alert>
					}
				>
					<Home />
				</ApmErrorBoundary>
			</InnloggetSaksbehandlerResolver>
		</ApmErrorBoundary>
	);
};

export default AppIndex;
