import React from 'react';
import { createRoot } from 'react-dom/client';
import { createRoutesFromChildren, matchRoutes, useLocation, useNavigationType } from 'react-router';
import { init } from '@sentry/browser';
import { breadcrumbsIntegration, reactRouterV6BrowserTracingIntegration } from '@sentry/react';
import AppContainer from 'app/AppContainer';

const environment = window.location.hostname;

const app = document.getElementById('app');
if (app === null) {
	throw new Error('No app element');
}
const root = createRoot(app);

if (environment.includes('nav.no')) {
	init({
		dsn: 'https://ee88a0763c614159ba73dbae305f737e@sentry.gc.nav.no/38',
		release: import.meta.env.VITE_SENTRY_RELEASE || 'unknown',
		tracesSampleRate: 1.0,
		integrations: [
			breadcrumbsIntegration({ console: false }),
			reactRouterV6BrowserTracingIntegration({
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

root.render(<AppContainer />);
