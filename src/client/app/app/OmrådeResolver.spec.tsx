import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useInnloggetBrukersOmråder } from 'api/queries/områdeQueries';
import { describe, expect, it, vi } from 'vitest';
import OmrådeResolver from './OmrådeResolver';

vi.mock('api/queries/områdeQueries', () => ({
	useInnloggetBrukersOmråder: vi.fn(),
}));

const queryResult = (overrides: Record<string, unknown>) =>
	({
		data: undefined,
		isPending: false,
		isError: false,
		refetch: vi.fn(),
		...overrides,
	}) as unknown as ReturnType<typeof useInnloggetBrukersOmråder>;

const renderResolver = () =>
	render(<OmrådeResolver k9={<div>K9-app</div>} aktivitetspenger={<div>Aktivitetspenger-app</div>} />);

describe('OmrådeResolver', () => {
	it('rendrer K9 direkte når det er eneste tilgjengelige område', () => {
		vi.mocked(useInnloggetBrukersOmråder).mockReturnValue(queryResult({ data: ['K9'] }));

		renderResolver();

		expect(screen.getByText('K9-app')).toBeInTheDocument();
		expect(screen.queryByRole('heading', { name: 'Velg område' })).not.toBeInTheDocument();
	});

	it('venter med å rendre appene til brukeren har valgt område', async () => {
		const user = userEvent.setup();
		vi.mocked(useInnloggetBrukersOmråder).mockReturnValue(queryResult({ data: ['K9', 'AKTIVITETSPENGER'] }));

		renderResolver();

		expect(screen.getByRole('heading', { name: 'Velg område' })).toBeInTheDocument();
		expect(screen.queryByText('K9-app')).not.toBeInTheDocument();
		expect(screen.queryByText('Aktivitetspenger-app')).not.toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: 'Pleiepenger, omsorgspenger og opplæringspenger' }));

		expect(screen.getByText('K9-app')).toBeInTheDocument();
	});

	it('rendrer aktivitetspenger etter at brukeren har valgt området', async () => {
		const user = userEvent.setup();
		vi.mocked(useInnloggetBrukersOmråder).mockReturnValue(queryResult({ data: ['K9', 'AKTIVITETSPENGER'] }));

		renderResolver();
		await user.click(screen.getByRole('button', { name: 'Aktivitetspenger' }));

		expect(screen.getByText('Aktivitetspenger-app')).toBeInTheDocument();
	});

	it('viser en feilmelding og lar brukeren prøve på nytt', async () => {
		const user = userEvent.setup();
		const refetch = vi.fn();
		vi.mocked(useInnloggetBrukersOmråder).mockReturnValue(queryResult({ isError: true, refetch }));

		renderResolver();
		await user.click(screen.getByRole('button', { name: 'Prøv på nytt' }));

		expect(screen.getByText('Kunne ikke hente områdene dine')).toBeInTheDocument();
		expect(refetch).toHaveBeenCalledOnce();
	});
});
