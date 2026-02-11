/* eslint-disable import/no-unused-modules */
 
 
import React from 'react';
import { createRoot } from 'react-dom/client';
import { createRoutesFromChildren, matchRoutes, useLocation, useNavigationType } from 'react-router';
import { init } from '@sentry/browser';
import { breadcrumbsIntegration, reactRouterV6BrowserTracingIntegration } from '@sentry/react';
import '@navikt/ds-css';
import AppContainer from 'app/AppContainer';
import { setEnvVariables } from 'app/envVariablesUtils';

/* eslint no-undef: "error" */
const environment = window.location.hostname;

async function prepare() {
	if (environment.includes('nav.no')) {
		init({
			dsn: 'https://ee88a0763c614159ba73dbae305f737e@sentry.gc.nav.no/38',
			release: process.env.SENTRY_RELEASE || 'unknown',
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
	return Promise.resolve();
}

const app = document.getElementById('app');
if (app === null) {
	throw new Error('No app element');
}
const root = createRoot(app);
async function bootstrap() {
	await setEnvVariables();

	root.render(<AppContainer />);
}

prepare().then(() => {
	bootstrap();
});
