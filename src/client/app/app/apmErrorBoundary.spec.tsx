import { init } from '@nais/apm';
import { ApmErrorBoundary } from '@nais/apm/react';
import { render, screen } from '@testing-library/react';
import type { FunctionComponent } from 'react';
import { beforeAll, describe, expect, it, vi } from 'vitest';

/**
 * AppIndex bruker to nivåer av ApmErrorBoundary: den indre lar header og
 * sesjonsmodal overleve en krasj i sideinnholdet, den ytre fanger feil i
 * resolveren og headeren. Testene under låser de to egenskapene det hviler på –
 * at den indre isolerer, og at den ikke lar feilen boble videre og bli
 * dobbeltrapportert.
 */

const Krasjer: FunctionComponent = () => {
	throw new Error('krasj i innhold');
};

beforeAll(() => {
	// Uten collector-URL kjører @nais/apm i dev-modus: ingenting sendes over nett.
	init({ app: 'k9-los-web', namespace: 'k9saksbehandling', environment: 'test' });
	// React logger fanget feil til console.error uansett boundary.
	vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('nøstede ApmErrorBoundary-nivåer', () => {
	it('lar innhold utenfor den indre grensen overleve en krasj i den', () => {
		const ytreOnError = vi.fn();

		render(
			<ApmErrorBoundary onError={ytreOnError} fallback={<span>ytre fallback</span>}>
				<span>header</span>
				<ApmErrorBoundary fallback={<span>indre fallback</span>}>
					<Krasjer />
				</ApmErrorBoundary>
			</ApmErrorBoundary>,
		);

		expect(screen.getByText('header')).toBeInTheDocument();
		expect(screen.getByText('indre fallback')).toBeInTheDocument();
		expect(screen.queryByText('ytre fallback')).not.toBeInTheDocument();
		// Den indre svelger feilen, så den ytre rapporterer ikke samme feil på nytt.
		expect(ytreOnError).not.toHaveBeenCalled();
	});

	it('fanger feil som oppstår utenfor den indre grensen', () => {
		const ytreOnError = vi.fn();

		render(
			<ApmErrorBoundary onError={ytreOnError} fallback={<span>ytre fallback</span>}>
				<Krasjer />
				<ApmErrorBoundary fallback={<span>indre fallback</span>}>
					<span>innhold</span>
				</ApmErrorBoundary>
			</ApmErrorBoundary>,
		);

		expect(screen.getByText('ytre fallback')).toBeInTheDocument();
		expect(ytreOnError).toHaveBeenCalledTimes(1);
	});
});
