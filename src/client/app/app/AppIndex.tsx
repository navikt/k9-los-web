import React, { FunctionComponent, useCallback, useState } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { useLocation } from 'react-router';
import { parseQueryString } from 'utils/urlUtils';
import '../../styles/global.css';
import { Button, Modal } from '@navikt/ds-react';
import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
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
	const [headerHeight, setHeaderHeight] = useState(0);
	const [crashMessage, setCrashMessage] = useState<string>();
	const [sessionHarUtlopt, setSessionHarUtlopt] = useState<boolean>(false);
	const timeout = 1000 * 60 * 58;

	const handleOnIdle = (): void => {
		setSessionHarUtlopt(true);
	};

	useIdleTimer({
		timeout,
		onIdle: handleOnIdle,
	});

	const setSiteHeight = useCallback((newHeaderHeight): void => {
		document.documentElement.setAttribute('style', `height: calc(100% - ${newHeaderHeight}px)`);
		setHeaderHeight(newHeaderHeight);
	}, []);

	const addErrorMessageAndSetAsCrashed = (error: string) => {
		setCrashMessage(error);
	};

	const location = useLocation();
	const queryStrings = parseQueryString(location.search);

	return (
		<ErrorBoundary errorMessageCallback={addErrorMessageAndSetAsCrashed}>
			<AppConfigResolver>
				<LanguageProvider>
					<HeaderWithErrorPanel queryStrings={queryStrings} setSiteHeight={setSiteHeight} crashMessage={crashMessage} />
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
					{!crashMessage && <Home headerHeight={headerHeight} />}
				</LanguageProvider>
			</AppConfigResolver>
		</ErrorBoundary>
	);
};

export default AppIndex;
