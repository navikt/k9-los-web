import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
	useEndreDriftsmeldingstatus,
	useHentDriftsmeldinger,
	useOpprettDriftsmelding,
	useSlettDriftsmelding,
} from 'api/generated/los';
import type { DriftsmeldingDto } from 'api/generated/los.schemas';
import DriftsmeldingBanner from 'fleromrade/DriftsmeldingBanner';
import { mutationResultat, queryResultat, renderMedOmråde } from 'fleromrade/testUtils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import DriftsmeldingerSide from './DriftsmeldingerSide';

vi.mock('api/generated/los', () => ({
	getHentDriftsmeldingerQueryKey: (omrade: string) => [`/api/fleromrade/${omrade}/driftsmeldinger`],
	useHentDriftsmeldinger: vi.fn(),
	useOpprettDriftsmelding: vi.fn(),
	useSlettDriftsmelding: vi.fn(),
	useEndreDriftsmeldingstatus: vi.fn(),
}));

const driftsmeldinger: DriftsmeldingDto[] = [
	{
		id: 'a',
		melding: 'Treg saksbehandling',
		aktiv: true,
		dato: '2026-09-18T08:00:00',
		aktivert: '2026-09-18T08:05:00',
	},
	{ id: 'b', melding: 'Planlagt nedetid', aktiv: false, dato: '2026-09-17T12:00:00', aktivert: null },
];

const mutasjoner = {
	opprett: mutationResultat(),
	slett: mutationResultat(),
	endre: mutationResultat(),
};

beforeEach(() => {
	mutasjoner.opprett = mutationResultat();
	mutasjoner.slett = mutationResultat();
	mutasjoner.endre = mutationResultat();
	vi.mocked(useHentDriftsmeldinger).mockReturnValue(queryResultat(driftsmeldinger));
	vi.mocked(useOpprettDriftsmelding).mockReturnValue(mutasjoner.opprett);
	vi.mocked(useSlettDriftsmelding).mockReturnValue(mutasjoner.slett);
	vi.mocked(useEndreDriftsmeldingstatus).mockReturnValue(mutasjoner.endre);
});

const mutate = (mutasjon: never) => (mutasjon as { mutate: ReturnType<typeof vi.fn> }).mutate;

describe('DriftsmeldingBanner', () => {
	it('viser kun aktive driftsmeldinger for området', () => {
		renderMedOmråde(<DriftsmeldingBanner />);

		expect(useHentDriftsmeldinger).toHaveBeenCalledWith('akt');
		expect(screen.getByRole('heading', { name: 'Advarsel: Treg saksbehandling' })).toBeInTheDocument();
		expect(screen.getByText('Registrert 18.09.2026 kl. 08:05')).toBeInTheDocument();
		expect(screen.queryByText('Planlagt nedetid')).not.toBeInTheDocument();
	});
});

describe('DriftsmeldingerSide', () => {
	it('lister driftsmeldinger med nyeste først', () => {
		renderMedOmråde(<DriftsmeldingerSide />);

		const rader = screen.getAllByRole('row').slice(1);
		expect(within(rader[0]).getByText('Treg saksbehandling')).toBeInTheDocument();
		expect(within(rader[1]).getByText('Planlagt nedetid')).toBeInTheDocument();
	});

	it('legger til en driftsmelding for området', async () => {
		const user = userEvent.setup();
		renderMedOmråde(<DriftsmeldingerSide />);

		await user.type(screen.getByLabelText('Ny driftsmelding'), 'Ustabil innlogging');
		await user.click(screen.getByRole('button', { name: 'Legg til' }));

		expect(mutate(mutasjoner.opprett)).toHaveBeenCalledWith(
			{ omrade: 'akt', data: { driftsmelding: 'Ustabil innlogging' } },
			expect.anything(),
		);
	});

	it('slår en driftsmelding av og på', async () => {
		const user = userEvent.setup();
		renderMedOmråde(<DriftsmeldingerSide />);

		await user.click(screen.getByRole('checkbox', { name: 'Aktiv: Planlagt nedetid' }));

		expect(mutate(mutasjoner.endre)).toHaveBeenCalledWith({ omrade: 'akt', data: { id: 'b', aktiv: true } });
	});

	it('sletter en driftsmelding etter bekreftelse', async () => {
		const user = userEvent.setup();
		renderMedOmråde(<DriftsmeldingerSide />);

		await user.click(screen.getByRole('button', { name: 'Slett Treg saksbehandling' }));
		expect(mutate(mutasjoner.slett)).not.toHaveBeenCalled();

		await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Slett' }));

		expect(mutate(mutasjoner.slett)).toHaveBeenCalledWith({ omrade: 'akt', data: { id: 'a' } });
	});
});
