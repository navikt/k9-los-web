import { init as initApm } from '@nais/apm';
import { init } from '@sentry/browser';
import { breadcrumbsIntegration, reactRouterV7BrowserTracingIntegration } from '@sentry/react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { createRoutesFromChildren, matchRoutes, useLocation, useNavigationType } from 'react-router';

const naisConfigUrl = '/public/nais.js';
const { default: naisConfig } = await import(/* @vite-ignore */ naisConfigUrl);
window.nais = naisConfig;

const environment = window.location.hostname;
const isNais = environment.includes('nav.no');

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

const app = document.getElementById('app');
if (app === null) {
	throw new Error('No app element');
}
const root = createRoot(app);

if (isNais) {
	init({
		dsn: 'https://ee88a0763c614159ba73dbae305f737e@sentry.gc.nav.no/38',
		release: import.meta.env.VITE_SENTRY_RELEASE || 'unknown',
		tracesSampleRate: 1.0,
		integrations: [
			breadcrumbsIntegration({ console: false }),
			reactRouterV7BrowserTracingIntegration({
				useEffect: React.useEffect,
				useLocation,
				useNavigationType,
				createRoutesFromChildren,
				matchRoutes,
			}),
		],
		environment,
	});
}

const { default: AppContainer } = await import('app/AppContainer');
root.render(<AppContainer />);
