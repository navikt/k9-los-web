declare global {
	interface Window {
		nais?: {
			telemetryCollectorURL: string;
			app: {
				name: string;
				namespace?: string;
				version?: string;
			};
		};
	}

	interface ImportMetaEnv {
		readonly VITE_APP_VERSION?: string;
		readonly VITE_SENTRY_RELEASE?: string;
	}

	interface ImportMeta {
		readonly env: ImportMetaEnv;
	}
}

export {};
