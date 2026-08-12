import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import KopierbarVerdi, { Kopieringsområde } from './KopierbarVerdi';
import styles from './kopierbarVerdi.module.css';

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

	it('kopierer riktig verdi', async () => {
		const user = userEvent.setup();
		render(
			<KopierbarVerdi copyText="01019012345" title="Kopier fødselsnummer">
				01019012345
			</KopierbarVerdi>,
		);

		await user.click(screen.getByRole('button', { name: 'Kopier fødselsnummer' }));

		expect(await navigator.clipboard.readText()).toBe('01019012345');
	});

	it('legger hoverområdet på elementet uten en ekstra wrapper', () => {
		const { container } = render(
			<Kopieringsområde>
				<section data-testid="område">Innhold</section>
			</Kopieringsområde>,
		);

		expect(screen.getByTestId('område')).toHaveClass(styles.område);
		expect(container.firstElementChild).toBe(screen.getByTestId('område'));
	});
});
