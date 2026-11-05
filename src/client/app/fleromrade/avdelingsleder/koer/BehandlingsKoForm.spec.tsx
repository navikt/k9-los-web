import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AppContext from 'app/AppContext';
import {
	useHentSaksbehandlereAvdelingsleder,
	useKo,
	useOppdaterKøMutation,
} from 'fleromrade/api/avdelingslederQueries';
import { lagKø } from 'fleromrade/saksbehandler/testdata';
import { mutationResultat, queryResultat, renderMedOmråde } from 'fleromrade/testUtils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import BehandlingsKoForm from './BehandlingsKoForm';

vi.mock('fleromrade/api/avdelingslederQueries');

const lagre = vi.fn();

const visSkjema = () =>
	renderMedOmråde(
		<AppContext.Provider value={{ felter: [] }}>
			<BehandlingsKoForm id="1" ekspandert lukk={vi.fn()} />
		</AppContext.Provider>,
	);

beforeEach(() => {
	vi.clearAllMocks();
	vi.mocked(useKo).mockReturnValue(queryResultat({ ...lagKø(), id: '1' }));
	vi.mocked(useHentSaksbehandlereAvdelingsleder).mockReturnValue(queryResultat([]));
	vi.mocked(useOppdaterKøMutation).mockReturnValue(mutationResultat({ mutate: lagre }));
});

describe('Fritt valg av oppgave', () => {
	it('er av som standard og lagres sammen med oppgavekøen', async () => {
		const user = userEvent.setup();
		visSkjema();
		const bryter = screen.getByRole('checkbox', { name: /^Fritt valg av oppgave/ });
		expect(bryter).not.toBeChecked();
		expect(screen.getByRole('button', { name: 'Lagre oppgavekø' })).toBeDisabled();
		await user.click(bryter);
		expect(screen.getByText(/Du har gjort endringer i køen/)).toBeInTheDocument();
		await user.click(screen.getByRole('button', { name: 'Lagre oppgavekø' }));

		expect(lagre).toHaveBeenCalledWith(expect.objectContaining({ id: '1', frittValgAvOppgave: true }));
	});

	it('viser lagret verdi og kan slå den av', async () => {
		const user = userEvent.setup();
		vi.mocked(useKo).mockReturnValue(queryResultat({ ...lagKø({ frittValgAvOppgave: true }), id: '1' }));
		visSkjema();
		const bryter = screen.getByRole('checkbox', { name: /^Fritt valg av oppgave/ });
		expect(bryter).toBeChecked();
		await user.click(bryter);
		await user.click(screen.getByRole('button', { name: 'Lagre oppgavekø' }));

		expect(lagre).toHaveBeenCalledWith(expect.objectContaining({ frittValgAvOppgave: false }));
	});

	it('er av når feltet mangler i køen', () => {
		vi.mocked(useKo).mockReturnValue(queryResultat({ ...lagKø(), id: '1', frittValgAvOppgave: undefined }));
		visSkjema();
		expect(screen.getByRole('checkbox', { name: /^Fritt valg av oppgave/ })).not.toBeChecked();
	});

	it('forkaster ulagret verdi når skjemaet lukkes og åpnes igjen', async () => {
		const user = userEvent.setup();
		const skjema = (ekspandert: boolean) => (
			<AppContext.Provider value={{ felter: [] }}>
				<BehandlingsKoForm id="1" ekspandert={ekspandert} lukk={vi.fn()} />
			</AppContext.Provider>
		);
		const { rerender } = renderMedOmråde(skjema(true));
		await user.click(screen.getByRole('checkbox', { name: /^Fritt valg av oppgave/ }));
		rerender(skjema(false));
		rerender(skjema(true));

		expect(screen.getByRole('checkbox', { name: /^Fritt valg av oppgave/ })).not.toBeChecked();
		expect(lagre).not.toHaveBeenCalled();
	});
});
