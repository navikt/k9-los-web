import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AppContext from 'app/AppContext';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
	type FeltverdiOppgavefilter,
	type Oppgavefelt,
	OppgavefilterKode,
	type OppgaveQuery,
	Synlighet,
	TolkesSom,
	type Verdiforklaring,
} from './filterTsTypes';
import KøKriterieEditor from './KøKriterieEditor';

const { post } = vi.hoisted(() => ({ post: vi.fn() }));
vi.mock('utils/reactQueryConfig', () => ({ axiosInstance: { post } }));

type Bruker = ReturnType<typeof userEvent.setup>;

const verdiforklaring = (verdi: string, visningsnavn: string, gruppering?: string): Verdiforklaring => ({
	verdi,
	visningsnavn,
	gruppering,
	synlighet: Synlighet.OverStreken,
	rekkefølge: undefined,
});

const felt = (
	kode: string,
	visningsnavn: string,
	tolkes_som: TolkesSom,
	ekstra: Partial<Oppgavefelt> = {},
): Oppgavefelt => ({
	område: 'K9',
	kode,
	visningsnavn,
	tolkes_som,
	synlighet: Synlighet.OverStreken,
	listetype: false,
	verdiforklaringerErUttømmende: false,
	verdiforklaringer: [],
	...ekstra,
});

const aksjonspunkter = ['5038', '5039', '5046', '5047', '5049', '5052', '5058', '5084', '6014', '6015'];
const felter: Oppgavefelt[] = [
	felt(
		OppgavefilterKode.AkkumulertVentetidAnnet,
		'Hittil akkumulert ventetid på annet for denne oppgaven',
		TolkesSom.Duration,
	),
	felt(OppgavefilterKode.RegistrertDato, 'Registrert dato', TolkesSom.Timestamp),
	felt(OppgavefilterKode.LiggerHosBeslutter, 'Til beslutter', TolkesSom.Boolean),
	felt(OppgavefilterKode.NyeKrav, 'Søknad inneholder nye perioder', TolkesSom.Boolean),
	felt(OppgavefilterKode.AnsvarligSaksbehandler, 'Ansvarlig saksbehandler', TolkesSom.String),
	felt(OppgavefilterKode.Ytelsestype, 'Ytelsestype', TolkesSom.String, {
		verdiforklaringer: [verdiforklaring('PSB', 'Pleiepenger sykt barn'), verdiforklaring('OLP', 'Opplæringspenger')],
	}),
	felt(OppgavefilterKode.LøsbartAksjonspunkt, 'Aksjonspunkt: løsbart', TolkesSom.String, {
		listetype: true,
		verdiforklaringer: aksjonspunkter.map((kode, index) =>
			verdiforklaring(
				kode,
				`Aksjonspunkt ${kode}`,
				index < 7 ? 'Beregning' : index === 7 ? 'Tilkjent Ytelse/Simulering' : 'Kompletthet',
			),
		),
	}),
	felt(OppgavefilterKode.BehandlingTypekode, 'Behandlingstype', TolkesSom.String, {
		verdiforklaringer: [
			verdiforklaring('BT-002', 'Førstegangsbehandling', 'Ordinærbehandling'),
			verdiforklaring('BT-006', 'Innsyn', 'Øvrige behandlingstyper'),
		],
	}),
];

function visEditor(initialQuery?: OppgaveQuery) {
	const lagre = vi.fn<(query: OppgaveQuery) => void>();
	const avbryt = vi.fn();
	const client = new QueryClient({ defaultOptions: { mutations: { retry: false, gcTime: 0 } } });
	const visning = render(
		<QueryClientProvider client={client}>
			<AppContext.Provider value={{ felter }}>
				<KøKriterieEditor
					initialQuery={initialQuery}
					lagre={lagre}
					avbryt={avbryt}
					tittel="Kriterier for testkø"
					hovedknappTekst="Lagre"
				/>
			</AppContext.Provider>
		</QueryClientProvider>,
	);
	return { ...visning, lagre, avbryt };
}

async function leggTilKriterie(user: Bruker, navn: string) {
	await user.click(screen.getByRole('button', { name: 'Legg til nytt kriterie' }));
	await user.type(screen.getByRole('combobox', { name: 'Velg kriterie:' }), navn);
	await user.click(screen.getByRole('option', { name: navn }));
	await user.click(screen.getByRole('button', { name: 'Legg til' }));
}

async function lagreOgÅpneIgjen(user: Bruker, visning: ReturnType<typeof visEditor>, filter: FeltverdiOppgavefilter) {
	await user.click(screen.getByRole('button', { name: 'Lagre' }));
	const query: OppgaveQuery = { filtere: [filter], select: [], order: [] };
	await waitFor(() => expect(visning.lagre).toHaveBeenCalledExactlyOnceWith(query));
	expect(post).toHaveBeenCalledWith('/api/k9-los-api/ny-oppgavestyring/oppgave/validate', query);
	visning.unmount();
	return visEditor(query);
}

beforeEach(() => {
	post.mockReset();
	post.mockResolvedValue({ data: true });
});

describe('KøKriterieEditor', () => {
	it('lagrer varighet som ISO-varighet og viser antall dager ved gjenåpning', async () => {
		const user = userEvent.setup();
		const visning = visEditor();
		await leggTilKriterie(user, felter[0].visningsnavn);
		await user.selectOptions(screen.getByRole('combobox', { name: 'Operator' }), 'GREATER_THAN_OR_EQUALS');
		await user.type(screen.getByRole('spinbutton', { name: 'Antall dager' }), '3');
		await lagreOgÅpneIgjen(user, visning, {
			type: 'feltverdi',
			område: 'K9',
			kode: OppgavefilterKode.AkkumulertVentetidAnnet,
			operator: 'GREATER_THAN_OR_EQUALS',
			verdi: ['P3D'],
		});
		expect(screen.getByRole('spinbutton', { name: 'Antall dager' })).toHaveValue(3);
		expect(screen.getByRole('combobox', { name: 'Operator' })).toHaveValue('GREATER_THAN_OR_EQUALS');
	});

	it('lagrer begge datoene i et intervall og viser dem ved gjenåpning', async () => {
		const user = userEvent.setup();
		const visning = visEditor();
		await leggTilKriterie(user, 'Registrert dato');
		await user.selectOptions(screen.getByRole('combobox', { name: 'Operator' }), 'INTERVAL');
		await user.type(screen.getByRole('textbox', { name: 'Fra' }), '01.01.2024');
		await user.tab();
		await user.type(screen.getByRole('textbox', { name: 'Til' }), '06.01.2024');
		await user.tab();
		await lagreOgÅpneIgjen(user, visning, {
			type: 'feltverdi',
			område: 'K9',
			kode: OppgavefilterKode.RegistrertDato,
			operator: 'INTERVAL',
			verdi: ['2024-01-01', '2024-01-06'],
		});
		expect(screen.getByRole('textbox', { name: 'Fra' })).toHaveValue('01.01.2024');
		expect(screen.getByRole('textbox', { name: 'Til' })).toHaveValue('06.01.2024');
	});

	it.each([
		[OppgavefilterKode.LiggerHosBeslutter, 'Til beslutter'],
		[OppgavefilterKode.NyeKrav, 'Søknad inneholder nye perioder'],
	])('lagrer boolsk kriterie %s og gjenoppretter avkryssingen', async (kode, navn) => {
		const user = userEvent.setup();
		const visning = visEditor();
		await leggTilKriterie(user, navn);
		await user.click(within(screen.getByRole('group', { name: navn })).getByRole('checkbox', { name: 'Ja' }));
		await lagreOgÅpneIgjen(user, visning, { type: 'feltverdi', område: 'K9', kode, operator: 'IN', verdi: ['true'] });
		expect(within(screen.getByRole('group', { name: navn })).getByRole('checkbox', { name: 'Ja' })).toBeChecked();
	});

	it('lagrer ansvarlig saksbehandler som fritekst', async () => {
		const user = userEvent.setup();
		const visning = visEditor();
		await leggTilKriterie(user, 'Ansvarlig saksbehandler');
		await user.type(screen.getByRole('textbox', { name: 'Skriv fritekst' }), 'M13337');
		await lagreOgÅpneIgjen(user, visning, {
			type: 'feltverdi',
			område: 'K9',
			kode: OppgavefilterKode.AnsvarligSaksbehandler,
			operator: 'EQUALS',
			verdi: ['M13337'],
		});
		expect(screen.getByRole('textbox', { name: 'Skriv fritekst' })).toHaveValue('M13337');
	});

	it('lagrer valgt ytelse og viser den ved gjenåpning', async () => {
		const user = userEvent.setup();
		const visning = visEditor();
		await leggTilKriterie(user, 'Ytelsestype');
		await user.type(screen.getByRole('combobox', { name: 'Ytelsestype' }), 'Pleiepenger');
		await user.click(screen.getByRole('option', { name: 'Pleiepenger sykt barn' }));
		await lagreOgÅpneIgjen(user, visning, {
			type: 'feltverdi',
			område: 'K9',
			kode: OppgavefilterKode.Ytelsestype,
			operator: 'IN',
			verdi: ['PSB'],
		});
		expect(screen.getByRole('button', { name: 'Pleiepenger sykt barn slett' })).toBeInTheDocument();
	});

	it('beholder alle ti aksjonspunktkodene og grupperer dem ved gjenåpning', async () => {
		const user = userEvent.setup();
		const visning = visEditor();
		await leggTilKriterie(user, 'Aksjonspunkt: løsbart');
		const søk = screen.getByLabelText('Aksjonspunkt: løsbart');
		for (const kode of aksjonspunkter) {
			await user.clear(søk);
			await user.type(søk, kode);
			await user.click(screen.getByRole('checkbox', { name: new RegExp(kode) }));
		}
		await lagreOgÅpneIgjen(user, visning, {
			type: 'feltverdi',
			område: 'K9',
			kode: OppgavefilterKode.LøsbartAksjonspunkt,
			operator: 'IN',
			verdi: aksjonspunkter,
		});
		for (const gruppe of ['Beregning (7)', 'Kompletthet (2)', 'Tilkjent Ytelse/Simulering (1)']) {
			expect(screen.getByRole('button', { name: gruppe })).toBeInTheDocument();
		}
	});

	it('beholder flere behandlingstyper og grupperer dem ved gjenåpning', async () => {
		const user = userEvent.setup();
		const visning = visEditor();
		await leggTilKriterie(user, 'Behandlingstype');
		const søk = screen.getByLabelText('Behandlingstype');
		for (const navn of ['Førstegangsbehandling', 'Innsyn']) {
			await user.clear(søk);
			await user.type(søk, navn);
			await user.click(screen.getByRole('checkbox', { name: navn }));
		}
		await lagreOgÅpneIgjen(user, visning, {
			type: 'feltverdi',
			område: 'K9',
			kode: OppgavefilterKode.BehandlingTypekode,
			operator: 'IN',
			verdi: ['BT-002', 'BT-006'],
		});
		expect(screen.getByRole('button', { name: 'Ordinærbehandling (1)' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Øvrige behandlingstyper (1)' })).toBeInTheDocument();
	});

	it('endrer ett kriterie uten å miste resten av kriteriematrisen', async () => {
		const user = userEvent.setup();
		const felles = { type: 'feltverdi' as const, område: 'K9', operator: 'IN' };
		const query: OppgaveQuery = {
			filtere: [
				{
					...felles,
					kode: OppgavefilterKode.AkkumulertVentetidAnnet,
					operator: 'GREATER_THAN_OR_EQUALS',
					verdi: ['P3D'],
				},
				{
					...felles,
					kode: OppgavefilterKode.RegistrertDato,
					operator: 'INTERVAL',
					verdi: ['2024-01-01', '2024-01-06'],
				},
				{ ...felles, kode: OppgavefilterKode.LøsbartAksjonspunkt, verdi: aksjonspunkter },
				{ ...felles, kode: OppgavefilterKode.BehandlingTypekode, verdi: ['BT-002', 'BT-006'] },
				{ ...felles, kode: OppgavefilterKode.Ytelsestype, verdi: ['PSB'] },
				{ ...felles, kode: OppgavefilterKode.LiggerHosBeslutter, verdi: ['true'] },
				{ ...felles, kode: OppgavefilterKode.NyeKrav, verdi: ['true'] },
				{ ...felles, kode: OppgavefilterKode.AnsvarligSaksbehandler, operator: 'EQUALS', verdi: ['M13337'] },
			],
			select: [],
			order: [],
		};
		const visning = visEditor(query);
		const input = screen.getByRole('textbox', { name: 'Skriv fritekst' });
		await user.clear(input);
		await user.type(input, 'M14444');
		await user.click(screen.getByRole('button', { name: 'Lagre' }));
		const forventet: OppgaveQuery = {
			...query,
			filtere: [
				...query.filtere.slice(0, -1),
				{ ...felles, kode: OppgavefilterKode.AnsvarligSaksbehandler, operator: 'EQUALS', verdi: ['M14444'] },
			],
		};
		await waitFor(() => expect(visning.lagre).toHaveBeenCalledExactlyOnceWith(forventet));
		visning.unmount();
		visEditor(forventet);
		expect(screen.getByRole('spinbutton', { name: 'Antall dager' })).toHaveValue(3);
		expect(screen.getByRole('textbox', { name: 'Fra' })).toHaveValue('01.01.2024');
		expect(screen.getByRole('textbox', { name: 'Til' })).toHaveValue('06.01.2024');
		expect(screen.getByRole('textbox', { name: 'Skriv fritekst' })).toHaveValue('M14444');
		for (const navn of ['Til beslutter', 'Søknad inneholder nye perioder']) {
			expect(within(screen.getByRole('group', { name: navn })).getByRole('checkbox', { name: 'Ja' })).toBeChecked();
		}
		for (const navn of [
			'Beregning (7)',
			'Kompletthet (2)',
			'Tilkjent Ytelse/Simulering (1)',
			'Ordinærbehandling (1)',
			'Øvrige behandlingstyper (1)',
			'Pleiepenger sykt barn slett',
		]) {
			expect(screen.getByRole('button', { name: navn })).toBeInTheDocument();
		}
	});

	it('lagrer ikke når en kriterieverdi mangler, selv om backend godkjenner queryen', async () => {
		const user = userEvent.setup();
		const { lagre } = visEditor();
		await leggTilKriterie(user, 'Ansvarlig saksbehandler');
		await user.click(screen.getByRole('button', { name: 'Lagre' }));
		expect(
			await screen.findByText('Kriteriene er ikke gyldige. Kriterier for kø kan ikke lagres.'),
		).toBeInTheDocument();
		expect(lagre).not.toHaveBeenCalled();
	});

	it('lagrer ikke når backend avviser kriteriene', async () => {
		post.mockResolvedValue({ data: false });
		const user = userEvent.setup();
		const { lagre } = visEditor({
			filtere: [
				{
					type: 'feltverdi',
					område: 'K9',
					kode: OppgavefilterKode.AnsvarligSaksbehandler,
					operator: 'EQUALS',
					verdi: ['M13337'],
				},
			],
			select: [],
			order: [],
		});
		await user.click(screen.getByRole('button', { name: 'Lagre' }));
		expect(
			await screen.findByText('Kriteriene er ikke gyldige. Kriterier for kø kan ikke lagres.'),
		).toBeInTheDocument();
		expect(lagre).not.toHaveBeenCalled();
	});

	it('avbryter uten å lagre kriteriene', async () => {
		const user = userEvent.setup();
		const { avbryt, lagre } = visEditor();
		await user.click(screen.getByRole('button', { name: 'Avbryt' }));
		expect(avbryt).toHaveBeenCalledOnce();
		expect(lagre).not.toHaveBeenCalled();
		expect(post).not.toHaveBeenCalled();
	});
});
