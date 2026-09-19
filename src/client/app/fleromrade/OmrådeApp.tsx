import { ApmErrorBoundary, ApmRoutes } from '@nais/apm/react';
import { Box, LocalAlert } from '@navikt/ds-react';
import { useOmråde } from 'fleromrade/OmrådeContext';
import { Route } from 'react-router';
import Header from './Header';
import InnloggetBrukerResolver from './InnloggetBrukerResolver';
import KreverTilgang from './KreverTilgang';
import SesjonUtløptModal from './SesjonUtløptModal';
import SideFinnesIkke from './SideFinnesIkke';
import UnderUtvikling from './UnderUtvikling';

/**
 * Områdenøytralt skall for appen: header, sesjonsmodal og ruter under områdets basissti.
 * Forutsetter en OmrådeProvider over seg.
 */
const OmrådeApp = () => {
	const { basissti } = useOmråde();

	return (
		<InnloggetBrukerResolver>
			<Header />
			<SesjonUtløptModal />
			<ApmErrorBoundary
				fingerprint="omrade-innhold"
				fallback={
					<Box padding="space-16">
						<LocalAlert status="error">
							<LocalAlert.Header>
								<LocalAlert.Title>Det oppstod en teknisk feil. Last siden på nytt.</LocalAlert.Title>
							</LocalAlert.Header>
						</LocalAlert>
					</Box>
				}
			>
				<ApmRoutes>
					<Route path={basissti}>
						<Route
							index
							element={
								<KreverTilgang tilgang="basis">
									<UnderUtvikling tittel="Saksbehandler" />
								</KreverTilgang>
							}
						/>
						<Route
							path="avdelingsleder"
							element={
								<KreverTilgang tilgang="oppgavestyring">
									<UnderUtvikling tittel="Avdelingslederpanel" />
								</KreverTilgang>
							}
						/>
						<Route
							path="admin"
							element={
								<KreverTilgang tilgang="drift">
									<UnderUtvikling tittel="Driftsmeldinger" />
								</KreverTilgang>
							}
						/>
						<Route path="*" element={<SideFinnesIkke />} />
					</Route>
				</ApmRoutes>
			</ApmErrorBoundary>
		</InnloggetBrukerResolver>
	);
};

export default OmrådeApp;
