declare global {
	interface Window {
		nais?: {
			telemetryCollectorURL: string;
			app: any;
		};
	}
}

interface ImportMetaEnv {
	readonly VITE_SENTRY_RELEASE?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

export {};
