import React from 'react';
import { render } from '@testing-library/react';
import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import { Oppgavefeltverdi, OppgavefilterKode, TolkesSom } from 'filter/filterTsTypes';
import OppgaveFeltVisning from './OppgaveFeltVisning';

dayjs.extend(durationPlugin);

describe('OppgaveFeltVisning', () => {
	const oppgaveFelter: any[] = [
		{
			kode: 'felt1',
			visningsnavn: 'Felt 1',
			tolkes_som: TolkesSom.String,
			område: '',
			verdiforklaringerErUttømmende: false,
			verdiforklaringer: [],
		},
		{
			kode: 'felt2',
			visningsnavn: 'Felt 2',
			tolkes_som: TolkesSom.Boolean,
			område: '',
			verdiforklaringerErUttømmende: false,
			verdiforklaringer: [],
		},
		{
			kode: 'felt3',
			visningsnavn: 'Felt 3',
			tolkes_som: TolkesSom.Duration,
			område: '',
			verdiforklaringerErUttømmende: false,
			verdiforklaringer: [],
		},
		{
			kode: 'felt4',
			visningsnavn: 'Felt 4',
			tolkes_som: TolkesSom.Timestamp,
			område: '',
			verdiforklaringerErUttømmende: false,
			verdiforklaringer: [],
		},
		{
			kode: 'felt5',
			visningsnavn: 'Felt 5',
			tolkes_som: TolkesSom.String,
			område: '',
			verdiforklaringerErUttømmende: false,
			verdiforklaringer: [],
		},
		{
			kode: 'behandlingTypekode',
			visningsnavn: 'Behandlingstype',
			tolkes_som: TolkesSom.String,
			område: '',
			verdiforklaringerErUttømmende: false,
			verdiforklaringer: [
				{
					verdi: 'BT-002',
					visningsnavn: 'Førstegangsbehandling',
				},
				{
					verdi: 'BT-003',
					visningsnavn: 'Klage',
				},
			],
		},
		{
			område: 'K9',
			kode: 'aksjonspunkt',
			visningsnavn: 'Aksjonspunkt',
			tolkes_som: 'String',
			verdiforklaringerErUttømmende: false,
			verdiforklaringer: [
				{
					verdi: '9001',
					visningsnavn: 'Kontroller legeerklæring',
				},
			],
		},
	];

	const createOppgaveFeltverdi = (kode: any, verdi: any): Oppgavefeltverdi => ({
		kode,
		verdi,
		område: '',
	});

	it('should render "-" when oppgavefelt is not found', () => {
		const { getByText } = render(
			<OppgaveFeltVisning felt={createOppgaveFeltverdi('felt6', 'value')} oppgaveFelter={oppgaveFelter} />,
		);
		expect(getByText('-')).toBeInTheDocument();
	});

	it('should render "-" when verdi is not found', () => {
		const { getByText } = render(
			<OppgaveFeltVisning felt={createOppgaveFeltverdi('felt1', null)} oppgaveFelter={oppgaveFelter} />,
		);
		expect(getByText('-')).toBeInTheDocument();
	});

	it('should render "Ja" when tolkes_som is Boolean and verdi is "true"', () => {
		const { getByText } = render(
			<OppgaveFeltVisning felt={createOppgaveFeltverdi('felt2', 'true')} oppgaveFelter={oppgaveFelter} />,
		);
		expect(getByText('Ja')).toBeInTheDocument();
	});

	it('should render "Nei" when tolkes_som is Boolean and verdi is not "true"', () => {
		const { getByText } = render(
			<OppgaveFeltVisning felt={createOppgaveFeltverdi('felt2', 'false')} oppgaveFelter={oppgaveFelter} />,
		);
		expect(getByText('Nei')).toBeInTheDocument();
	});

	it('should render formatted duration when tolkes_som is Duration', () => {
		const { getByText } = render(
			<OppgaveFeltVisning felt={createOppgaveFeltverdi('felt3', 'PT26H32M')} oppgaveFelter={oppgaveFelter} />,
		);
		expect(getByText('1d 2t')).toBeInTheDocument();
	});

	it('should render formatted date when tolkes_som is Timestamp', () => {
		const { getByText } = render(
			<OppgaveFeltVisning
				felt={createOppgaveFeltverdi('felt4', '2022-01-01T00:00:00.000Z')}
				oppgaveFelter={oppgaveFelter}
			/>,
		);
		expect(getByText('01.01.2022')).toBeInTheDocument();
	});

	it('should render verdi when tolkes_som is not Boolean, Duration, or Timestamp', () => {
		const { getByText } = render(
			<OppgaveFeltVisning felt={createOppgaveFeltverdi('felt5', 'value')} oppgaveFelter={oppgaveFelter} />,
		);
		expect(getByText('value')).toBeInTheDocument();
	});

	it('should render comma-separated list when verdi is an array', () => {
		const { getByText } = render(
			<OppgaveFeltVisning felt={createOppgaveFeltverdi('felt5', ['value1', 'value2'])} oppgaveFelter={oppgaveFelter} />,
		);
		expect(getByText('value1, value2')).toBeInTheDocument();
	});

	it('should render the visningsnavn when behandlingTypekode matches a verdi in verdiforklaringer', () => {
		const oppgaveFelt = createOppgaveFeltverdi(OppgavefilterKode.BehandlingTypekode, 'BT-002');
		const { getByText } = render(<OppgaveFeltVisning felt={oppgaveFelt} oppgaveFelter={oppgaveFelter} />);
		expect(getByText('Førstegangsbehandling')).toBeInTheDocument();
	});

	it('should render the verdi when behandlingTypekode does not match a verdi in verdiforklaringer', () => {
		const oppgaveFelt = createOppgaveFeltverdi(OppgavefilterKode.BehandlingTypekode, 'BT-004');
		const { getByText } = render(<OppgaveFeltVisning felt={oppgaveFelt} oppgaveFelter={oppgaveFelter} />);
		expect(getByText('BT-004')).toBeInTheDocument();
	});

	it('should render aksjonspunkter when aksjonspunkter is not null', () => {
		const oppgaveFelt = createOppgaveFeltverdi(OppgavefilterKode.Aksjonspunkt, ['9001']);
		const { getByText } = render(<OppgaveFeltVisning felt={oppgaveFelt} oppgaveFelter={oppgaveFelter} />);
		expect(getByText('Kontroller legeerklæring')).toBeInTheDocument();
	});
});
