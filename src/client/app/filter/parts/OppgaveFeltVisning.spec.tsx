import { render, screen } from '@testing-library/react';
import { type Oppgavefelt, type Oppgavefeltverdi, OppgavefilterKode, Synlighet, TolkesSom } from 'filter/filterTsTypes';
import { describe, expect, it } from 'vitest';
import OppgaveFeltVisning from './OppgaveFeltVisning';

const lagFelt = (overrides: Partial<Oppgavefelt> & Pick<Oppgavefelt, 'kode'>): Oppgavefelt => ({
	område: '',
	visningsnavn: overrides.kode,
	synlighet: Synlighet.UnderStreken,
	tolkes_som: TolkesSom.String,
	listetype: false,
	verdiforklaringerErUttømmende: false,
	verdiforklaringer: [],
	...overrides,
});

const lagVerdiforklaring = (verdi: string, visningsnavn: string, gruppering?: string) => ({
	verdi,
	visningsnavn,
	gruppering,
	synlighet: Synlighet.OverStreken,
	rekkefølge: undefined,
});

describe('OppgaveFeltVisning', () => {
	const oppgaveFelter: Oppgavefelt[] = [
		lagFelt({ kode: 'felt1', visningsnavn: 'Felt 1' }),
		lagFelt({ kode: 'felt2', visningsnavn: 'Felt 2', tolkes_som: TolkesSom.Boolean }),
		lagFelt({ kode: 'felt3', visningsnavn: 'Felt 3', tolkes_som: TolkesSom.Duration }),
		lagFelt({ kode: 'felt4', visningsnavn: 'Felt 4', tolkes_som: TolkesSom.Timestamp }),
		lagFelt({ kode: 'felt5', visningsnavn: 'Felt 5' }),
		lagFelt({
			kode: 'behandlingTypekode',
			visningsnavn: 'Behandlingstype',
			verdiforklaringer: [lagVerdiforklaring('BT-002', 'Førstegangsbehandling'), lagVerdiforklaring('BT-003', 'Klage')],
		}),
		lagFelt({
			område: 'K9',
			kode: 'aksjonspunkt',
			visningsnavn: 'Aksjonspunkt',
			verdiforklaringer: [lagVerdiforklaring('9001', 'Kontroller legeerklæring', 'aksjonspunkt')],
		}),
	];

	const lagFeltverdi = (kode: string, verdi: Oppgavefeltverdi['verdi']): Oppgavefeltverdi => ({
		kode,
		verdi,
		område: '',
	});

	it('viser "-" når oppgavefeltet ikke finnes', () => {
		render(<OppgaveFeltVisning felt={lagFeltverdi('felt6', 'value')} oppgaveFelter={oppgaveFelter} />);
		expect(screen.getByText('-')).toBeInTheDocument();
	});

	it('viser "-" når verdien mangler', () => {
		render(<OppgaveFeltVisning felt={lagFeltverdi('felt1', null)} oppgaveFelter={oppgaveFelter} />);
		expect(screen.getByText('-')).toBeInTheDocument();
	});

	it('viser "Ja" for Boolean med verdi "true"', () => {
		render(<OppgaveFeltVisning felt={lagFeltverdi('felt2', 'true')} oppgaveFelter={oppgaveFelter} />);
		expect(screen.getByText('Ja')).toBeInTheDocument();
	});

	it('viser "Nei" for Boolean med annen verdi enn "true"', () => {
		render(<OppgaveFeltVisning felt={lagFeltverdi('felt2', 'false')} oppgaveFelter={oppgaveFelter} />);
		expect(screen.getByText('Nei')).toBeInTheDocument();
	});

	it('formaterer Duration', () => {
		render(<OppgaveFeltVisning felt={lagFeltverdi('felt3', 'PT26H32M')} oppgaveFelter={oppgaveFelter} />);
		expect(screen.getByText('1d 2t')).toBeInTheDocument();
	});

	it('formaterer Timestamp', () => {
		render(
			<OppgaveFeltVisning felt={lagFeltverdi('felt4', '2022-01-01T00:00:00.000Z')} oppgaveFelter={oppgaveFelter} />,
		);
		expect(screen.getByText('01.01.2022')).toBeInTheDocument();
	});

	it('viser verdien som den er for andre typer', () => {
		render(<OppgaveFeltVisning felt={lagFeltverdi('felt5', 'value')} oppgaveFelter={oppgaveFelter} />);
		expect(screen.getByText('value')).toBeInTheDocument();
	});

	it('viser kommaseparert liste når verdien er et array', () => {
		render(<OppgaveFeltVisning felt={lagFeltverdi('felt5', ['value1', 'value2'])} oppgaveFelter={oppgaveFelter} />);
		expect(screen.getByText('value1, value2')).toBeInTheDocument();
	});

	it('viser visningsnavn når behandlingstypen finnes i verdiforklaringene', () => {
		render(
			<OppgaveFeltVisning
				felt={lagFeltverdi(OppgavefilterKode.BehandlingTypekode, 'BT-002')}
				oppgaveFelter={oppgaveFelter}
			/>,
		);
		expect(screen.getByText('Førstegangsbehandling')).toBeInTheDocument();
	});

	it('viser råverdien når behandlingstypen ikke finnes i verdiforklaringene', () => {
		render(
			<OppgaveFeltVisning
				felt={lagFeltverdi(OppgavefilterKode.BehandlingTypekode, 'BT-004')}
				oppgaveFelter={oppgaveFelter}
			/>,
		);
		expect(screen.getByText('BT-004')).toBeInTheDocument();
	});

	it('viser aksjonspunkter med kode i parentes', () => {
		render(
			<OppgaveFeltVisning
				felt={lagFeltverdi(OppgavefilterKode.Aksjonspunkt, ['9001', '9999'])}
				oppgaveFelter={oppgaveFelter}
			/>,
		);
		expect(screen.getByText('Kontroller legeerklæring (9001), 9999')).toBeInTheDocument();
	});
});
