import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
	useHentFerdigstiltePerEnhet,
	useHentInngangOgFerdigstilte,
	useHentOppgavefelter,
	useHentStatusfordeling,
} from 'api/generated/los';
import AppContext from 'app/AppContext';
import { queryResultat, renderMedOmråde } from 'fleromrade/testUtils';
import { useContext } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AvdelingslederPanel from './AvdelingslederPanel';

vi.mock('api/generated/los');

const Felter = ({ navn }: { navn: string }) => {
	const { felter } = useContext(AppContext);
	return <div>{`${navn}: ${felter.map((felt) => felt.kode).join(', ')}`}</div>;
};

vi.mock('./koer/BehandlingskoerIndex', () => ({ default: () => <Felter navn="Køer" /> }));
vi.mock('./lagredeSøk/LagredeSøk', () => ({ LagredeSøk: () => <Felter navn="Lagrede søk" /> }));
vi.mock('./reservasjoner/components/AvdelingslederReservasjonerTabell', () => ({
	default: () => <div>Reservasjoner</div>,
}));
vi.mock('./saksbehandlere/components/SaksbehandlereTabell', () => ({ default: () => <div>Saksbehandlertabell</div> }));

const medFelter = () =>
	vi.mocked(useHentOppgavefelter).mockReturnValue(queryResultat([{ kode: 'oppgavestatus' }, { kode: 'ytelsestype' }]));

describe('AvdelingslederPanel', () => {
	beforeEach(() => {
		vi.mocked(useHentInngangOgFerdigstilte).mockReturnValue(queryResultat(undefined));
		vi.mocked(useHentFerdigstiltePerEnhet).mockReturnValue(queryResultat(undefined));
		vi.mocked(useHentStatusfordeling).mockReturnValue(queryResultat(undefined));
	});
	it('viser oppgavekøer som standard og gir filterkomponentene feltene for området', () => {
		medFelter();

		renderMedOmråde(<AvdelingslederPanel />, { sti: '/akt/avdelingsleder' });

		expect(useHentOppgavefelter).toHaveBeenCalledWith('akt', expect.anything());
		expect(screen.getByRole('tab', { name: 'Oppgavekøer', selected: true })).toBeInTheDocument();
		expect(screen.getByText('Køer: oppgavestatus, ytelsestype')).toBeInTheDocument();
	});

	it('har klikkbar nøkkeltallfane for aktivitetspenger og kaller backend når den åpnes', async () => {
		const user = userEvent.setup();
		medFelter();

		renderMedOmråde(<AvdelingslederPanel />, { sti: '/akt/avdelingsleder' });

		expect(screen.getAllByRole('tab').map((fane) => fane.textContent)).toEqual([
			'Oppgavekøer',
			'Lagrede søk',
			'Nøkkeltall',
			'Reservasjoner',
			'Saksbehandlere',
		]);
		expect(useHentStatusfordeling).toHaveBeenCalledWith('akt', expect.anything());
		expect(useHentInngangOgFerdigstilte).not.toHaveBeenCalled();
		await user.click(screen.getByRole('tab', { name: 'Nøkkeltall' }));
		expect(screen.getByRole('tab', { name: 'Nøkkeltall', selected: true })).toBeInTheDocument();
		expect(useHentInngangOgFerdigstilte).toHaveBeenCalledWith('akt', expect.anything());
		expect(useHentFerdigstiltePerEnhet).toHaveBeenCalledWith('akt', { gruppe: 'ALLE', uker: 2 }, expect.anything());
	});

	it('bruker de nye nøkkeltallhookene også for K9', async () => {
		const user = userEvent.setup();
		medFelter();

		renderMedOmråde(<AvdelingslederPanel />, { sti: '/k9-ny/avdelingsleder', område: 'K9' });

		expect(useHentStatusfordeling).toHaveBeenCalledWith('k9', expect.anything());
		expect(screen.getAllByRole('tab').map((fane) => fane.textContent)).toEqual([
			'Oppgavekøer',
			'Lagrede søk',
			'Nøkkeltall',
			'Reservasjoner',
			'Saksbehandlere',
		]);

		await user.click(screen.getByRole('tab', { name: 'Nøkkeltall' }));

		expect(useHentInngangOgFerdigstilte).toHaveBeenCalledWith('k9', expect.anything());
		expect(useHentFerdigstiltePerEnhet).toHaveBeenCalledWith('k9', { gruppe: 'ALLE', uker: 2 }, expect.anything());
	});

	it('åpner nøkkeltall for aktivitetspenger direkte fra URL-en', () => {
		medFelter();

		renderMedOmråde(<AvdelingslederPanel />, { sti: '/akt/avdelingsleder?fane=nokkeltall' });

		expect(screen.getByRole('tab', { name: 'Nøkkeltall', selected: true })).toBeInTheDocument();
		expect(useHentInngangOgFerdigstilte).toHaveBeenCalledWith('akt', expect.anything());
	});

	it('åpner fanen fra URL-en og oppdaterer den ved fanebytte', async () => {
		const user = userEvent.setup();
		medFelter();

		renderMedOmråde(<AvdelingslederPanel />, { sti: '/akt/avdelingsleder?fane=lagredesok&sok=1' });
		expect(screen.getByText('Lagrede søk: oppgavestatus, ytelsestype')).toBeInTheDocument();

		await user.click(screen.getByRole('tab', { name: 'Saksbehandlere' }));

		expect(screen.getByText('Saksbehandlertabell')).toBeInTheDocument();
		expect(screen.getByTestId('aktiv-sti')).toHaveTextContent('/akt/avdelingsleder?fane=saksbehandlere&sok=1');
	});

	it('forteller når feltene ikke kan hentes', () => {
		vi.mocked(useHentOppgavefelter).mockReturnValue(queryResultat(undefined, { isError: true, isSuccess: false }));

		renderMedOmråde(<AvdelingslederPanel />, { sti: '/akt/avdelingsleder' });

		expect(screen.getByText('Kunne ikke hente oppgavefeltene for området')).toBeInTheDocument();
		expect(screen.queryByRole('tab')).not.toBeInTheDocument();
	});
});
