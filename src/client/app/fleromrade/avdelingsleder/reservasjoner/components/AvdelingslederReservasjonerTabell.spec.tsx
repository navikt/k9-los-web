import { screen } from '@testing-library/react';
import { useAvdelingslederReservasjoner } from 'fleromrade/api/avdelingslederQueries';
import { queryResultat, renderMedOmråde } from 'fleromrade/testUtils';
import { describe, expect, it, vi } from 'vitest';
import AvdelingslederReservasjonerTabell from './AvdelingslederReservasjonerTabell';

vi.mock('fleromrade/api/avdelingslederQueries', () => ({ useAvdelingslederReservasjoner: vi.fn() }));

describe('AvdelingslederReservasjonerTabell', () => {
	it('beskriver hva det kan søkes på i området', () => {
		vi.mocked(useAvdelingslederReservasjoner).mockReturnValue(queryResultat([]));

		const { unmount } = renderMedOmråde(<AvdelingslederReservasjonerTabell />);
		// Aktivitetspenger har ikke journalpost-id på oppgavene.
		expect(
			screen.getByRole('searchbox', {
				name: 'Søk på reservasjon',
				description: 'Du kan søke på navn eller saksnummer',
			}),
		).toBeInTheDocument();
		unmount();

		renderMedOmråde(<AvdelingslederReservasjonerTabell />, { sti: '/k9-ny', område: 'K9' });
		expect(
			screen.getByRole('searchbox', {
				name: 'Søk på reservasjon',
				description: 'Du kan søke på navn, saksnummer eller journalpost-id',
			}),
		).toBeInTheDocument();
	});
});
