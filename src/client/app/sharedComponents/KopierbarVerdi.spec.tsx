import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import KopierbarVerdi from './KopierbarVerdi';

describe('KopierbarVerdi', () => {
	it('viser verdien og en kopiknapp med riktig tekst', () => {
		render(
			<KopierbarVerdi copyText="01019012345" title="Kopier fødselsnummer">
				01019012345
			</KopierbarVerdi>,
		);

		expect(screen.getByText('01019012345')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Kopier fødselsnummer' })).toBeInTheDocument();
	});
});
