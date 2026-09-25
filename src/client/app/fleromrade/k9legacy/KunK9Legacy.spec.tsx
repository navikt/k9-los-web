import { screen } from '@testing-library/react';
import { renderMedOmråde } from 'fleromrade/testUtils';
import { describe, expect, it } from 'vitest';
import { KunK9Legacy } from './KunK9Legacy';

describe('KunK9Legacy', () => {
	it('viser legacy-komponenten for K9', () => {
		renderMedOmråde(
			<KunK9Legacy>
				<div>Legacy</div>
			</KunK9Legacy>,
			{ område: 'K9', sti: '/k9-ny' },
		);

		expect(screen.getByText('Legacy')).toBeInTheDocument();
	});

	it('skjuler legacy-komponenten for andre områder', () => {
		renderMedOmråde(
			<KunK9Legacy>
				<div>Legacy</div>
			</KunK9Legacy>,
			{ område: 'AKTIVITETSPENGER' },
		);

		expect(screen.queryByText('Legacy')).not.toBeInTheDocument();
	});
});
