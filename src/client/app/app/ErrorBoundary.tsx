import { Component, ErrorInfo, ReactNode } from 'react';
import { faro } from '@grafana/faro-web-sdk';

interface OwnProps {
	errorMessageCallback: (error: string) => void;
	children: ReactNode;
}

interface State {
	hasError: boolean;
}

export class ErrorBoundary extends Component<OwnProps, State> {
	static getDerivedStateFromError() {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}

	componentDidCatch(error: Error, info: ErrorInfo): void {
		const { errorMessageCallback } = this.props;

		// React render-feil propagerer ikke til window.onerror, så Faros
		// auto-instrumentering fanger dem ikke. Vi sender dem derfor eksplisitt
		// til nais-APM. faro.api er kun definert når Faro er initialisert
		// (kun på nav.no-hostnavn), så vi guarder for lokal kjøring.
		faro?.api?.pushError(error, {
			context: { componentStack: info.componentStack ?? '' },
		});

		errorMessageCallback(
			[
				error.toString(),
				info.componentStack
					.split('\n')
					.map((line) => line.trim())
					.find((line) => !!line),
			].join(' '),
		);

		console.error(error);
	}

	render(): ReactNode {
		const { children } = this.props;
		return children;
	}
}

export default ErrorBoundary;
