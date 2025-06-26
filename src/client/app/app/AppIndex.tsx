import { FunctionComponent, useEffect, useState } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { useLocation } from 'react-router';
import { getWebInstrumentations, initializeFaro } from '@grafana/faro-web-sdk';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';
import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { Button, Modal } from '@navikt/ds-react';
import { parseQueryString } from 'utils/urlUtils';
import '../../styles/global.css';
import AppConfigResolver from './AppConfigResolver';
import ErrorBoundary from './ErrorBoundary';
import LanguageProvider from './LanguageProvider';
import HeaderWithErrorPanel from './components/HeaderWithErrorPanel';
import Home from './components/Home';

/**
 * AppIndex
 *
 * Container komponent. Dette er toppkomponenten i applikasjonen. Denne vil rendre header
 * og home-komponentene. Home-komponenten vil rendre barn-komponenter via ruter.
 * Komponenten er også ansvarlig for å hente innlogget NAV-ansatt, rettskilde-url,
 * og kodeverk fra server og lagre desse i klientens state.
 */

const AppIndex: FunctionComponent = () => {
	const [crashMessage, setCrashMessage] = useState<string>();
	const [sessionHarUtlopt, setSessionHarUtlopt] = useState<boolean>(false);

	useEffect(() => {
		if (window.location.hostname.includes('nav.no')) {
			if (window.nais?.app && window.nais?.telemetryCollectorURL) {
				initializeFaro({
					url: window.nais?.telemetryCollectorURL,
					app: window.nais?.app,
					instrumentations: [...getWebInstrumentations({ captureConsole: true }), new TracingInstrumentation()],
				});
			}
		}
	}, [window.nais?.app, window.nais?.telemetryCollectorURL]);

	const timeout = 1000 * 60 * 58;

	const handleOnIdle = (): void => {
		setSessionHarUtlopt(true);
	};

	useIdleTimer({
		timeout,
		onIdle: handleOnIdle,
	});

	const addErrorMessageAndSetAsCrashed = (error: string) => {
		setCrashMessage(error);
	};

	const location = useLocation();
	const queryStrings = parseQueryString(location.search);

	return (
		<ErrorBoundary errorMessageCallback={addErrorMessageAndSetAsCrashed}>
			<AppConfigResolver>
				<LanguageProvider>
					<HeaderWithErrorPanel queryStrings={queryStrings} crashMessage={crashMessage} />
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
					{!crashMessage && <Home />}
				</LanguageProvider>
			</AppConfigResolver>
		</ErrorBoundary>
	);
};

export default AppIndex;
