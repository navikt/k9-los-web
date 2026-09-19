import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useHentInnloggetBruker } from 'api/generated/los';
import { describe, expect, it, vi } from 'vitest';
import InnloggetBrukerResolver from './InnloggetBrukerResolver';
import { OmrådeProvider } from './OmrådeContext';

vi.mock('api/generated/los', () => ({
	useHentInnloggetBruker: vi.fn(),
}));

const queryResult = (overrides: Record<string, unknown>) =>
	({
		data: undefined,
		isPending: false,
		isError: false,
		refetch: vi.fn(),
		...overrides,
	}) as unknown as ReturnType<typeof useHentInnloggetBruker>;

const renderResolver = () =>
	render(
		<OmrådeProvider område="AKTIVITETSPENGER">
			<InnloggetBrukerResolver>
				<div>Innhold</div>
			</InnloggetBrukerResolver>
		</OmrådeProvider>,
	);

describe('InnloggetBrukerResolver', () => {
	it('henter innlogget bruker for området i konteksten', () => {
		vi.mocked(useHentInnloggetBruker).mockReturnValue(queryResult({ data: { brukerIdent: 'Z123456' } }));

		renderResolver();

		expect(useHentInnloggetBruker).toHaveBeenCalledWith('akt', expect.anything());
		expect(screen.getByText('Innhold')).toBeInTheDocument();
	});

	it('venter med innholdet til brukeren er hentet', () => {
		vi.mocked(useHentInnloggetBruker).mockReturnValue(queryResult({ isPending: true }));

		renderResolver();

		expect(screen.getByText('Henter brukeren din', { selector: 'p' })).toBeInTheDocument();
		expect(screen.queryByText('Innhold')).not.toBeInTheDocument();
	});

	it('viser en feilmelding og lar brukeren prøve på nytt', async () => {
		const user = userEvent.setup();
		const refetch = vi.fn();
		vi.mocked(useHentInnloggetBruker).mockReturnValue(queryResult({ isError: true, refetch }));

		renderResolver();
		await user.click(screen.getByRole('button', { name: 'Prøv på nytt' }));

		expect(screen.getByText('Kunne ikke hente brukeren din')).toBeInTheDocument();
		expect(refetch).toHaveBeenCalledOnce();
	});
});
