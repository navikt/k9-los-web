import type { MetaApp } from '@grafana/faro-web-sdk';

declare global {
	interface Window {
		nais?: {
			telemetryCollectorURL: string;
			app: MetaApp;
		};
	}

	interface ImportMetaEnv {
		readonly VITE_SENTRY_RELEASE?: string;
	}

	interface ImportMeta {
		readonly env: ImportMetaEnv;
	}
}
