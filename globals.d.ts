declare global {
	interface Window {
		nais?: {
			telemetryCollectorURL: string;
			app: any;
		};
	}
}

export {};
