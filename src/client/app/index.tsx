import { init as initApm } from '@nais/apm';
import { enableApmReactRouterV6 } from '@nais/apm/react';
import { createRoot } from 'react-dom/client';
import { createRoutesFromChildren, matchRoutes, Routes, useLocation, useNavigationType } from 'react-router';

// Entry-modulen lastes fra CDN, men runtime-konfigurasjonen finnes på app-originen.
// Feiler denne hentingen skal appen fortsatt starte: uten window.nais faller
// initApm tilbake på verdiene under, og telemetri havner i dev-modus i stedet for
// at hele siden blir blank.
const naisConfigUrl = new URL('/public/nais.js', window.location.origin).href;
try {
	const { default: naisConfig } = await import(/* @vite-ignore */ naisConfigUrl);
	window.nais = naisConfig;
} catch (error) {
	console.warn('Kunne ikke laste /public/nais.js – fortsetter uten nais-runtimekonfigurasjon', error);
}

const { hostname } = window.location;
const isNais = hostname.includes('nav.no');
// Nais APM grupperer og filtrerer på cluster-navnet, og backend-telemetrien fra
// autoInstrumentation bruker samme verdi. Sender vi hostname her, matcher ikke
// frontend og backend i samme visning.
const environment = hostname.includes('.dev.nav.no') ? 'dev-gcp' : isNais ? 'prod-gcp' : 'local';

initApm({
	app: window.nais?.app.name ?? 'k9-los-web',
	namespace: window.nais?.app.namespace ?? 'k9saksbehandling',
	version: import.meta.env.VITE_APP_VERSION ?? window.nais?.app.version,
	environment,
	telemetryUrl: isNais ? window.nais?.telemetryCollectorURL : undefined,
	tracing: true,
	beforeSend: (item) => {
		const pageUrl = item.meta?.page?.url;
		if (pageUrl) {
			item.meta.page.url = pageUrl.split(/[?#]/, 1)[0];
		}
		return item;
	},
});

// Må kalles etter initApm(). AppContainer lastes dynamisk lenger ned, så Home.tsx
// (som rendrer <ApmRoutes>) evalueres først når integrasjonen er på plass.
enableApmReactRouterV6({ createRoutesFromChildren, matchRoutes, Routes, useLocation, useNavigationType });

const app = document.getElementById('app');
if (app === null) {
	throw new Error('No app element');
}
const root = createRoot(app);

const { default: AppContainer } = await import('app/AppContainer');
root.render(<AppContainer />);
