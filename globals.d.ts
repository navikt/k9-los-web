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
	}

	interface ImportMeta {
		readonly env: ImportMetaEnv;
	}
}

export {};
