import { init } from '@nais/apm';
import { ApmRoutes, enableApmReactRouterV6 } from '@nais/apm/react';
import { render, screen } from '@testing-library/react';
import {
	createRoutesFromChildren,
	MemoryRouter,
	matchRoutes,
	Route,
	Routes,
	useLocation,
	useNavigationType,
} from 'react-router';
import { describe, expect, it } from 'vitest';

/**
 * `@nais/apm/react` dokumenterer kun støtte for React Router v6, mens appen kjører v8.
 * De fire APIene faro-react trenger finnes fortsatt i v8, men kombinasjonen er
 * udokumentert. Denne testen fanger opp hvis en react-router-oppgradering brekker
 * rutesporingen – uten den ville vi først oppdaget det som en blank side i prod,
 * siden <ApmRoutes> rendrer `undefined` når integrasjonen ikke er wiret opp.
 */
describe('@nais/apm rutesporing med react-router 8', () => {
	it('rendrer ruter gjennom ApmRoutes etter enableApmReactRouterV6', () => {
		// Uten collector-URL kjører @nais/apm i dev-modus: ingenting sendes over nett.
		init({ app: 'k9-los-web', namespace: 'k9saksbehandling', environment: 'test' });
		enableApmReactRouterV6({ createRoutesFromChildren, matchRoutes, Routes, useLocation, useNavigationType });

		render(
			<MemoryRouter initialEntries={['/avdelingsleder']}>
				<ApmRoutes>
					<Route path="/" element={<span>saksbehandler</span>} />
					<Route path="/avdelingsleder" element={<span>avdelingsleder</span>} />
					<Route path="*" element={<span>ikke funnet</span>} />
				</ApmRoutes>
			</MemoryRouter>,
		);

		expect(screen.getByText('avdelingsleder')).toBeInTheDocument();
	});
});
