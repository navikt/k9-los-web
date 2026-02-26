import { IdentifiedOppgaveQuery, tilIdentifiedQuery } from 'filter/filterFrontendTypes';
import { Oppgavefelt, OppgavefilterKode, Oppgaverad, TolkesSom } from 'filter/filterTsTypes';

export const oppgaveQueryForDuration: IdentifiedOppgaveQuery = tilIdentifiedQuery({
	filtere: [
		{
			type: 'feltverdi',
			område: 'K9',
			kode: OppgavefilterKode.AkkumulertVentetidSaksbehandlerForTidligereVersjoner,
			operator: 'GREATER_THAN',
			verdi: ['P100DT'],
		},
	],
	select: [
		{
			type: 'enkel',
			område: 'K9',
			kode: OppgavefilterKode.AkkumulertVentetidSaksbehandlerForTidligereVersjoner,
		},
	],
	order: [],
	limit: 10,
});

export const oppgaverMedDuration: Oppgaverad[] = [
	{
		id: '1',
		felter: [
			{
				område: 'K9',
				kode: OppgavefilterKode.AkkumulertVentetidSaksbehandlerForTidligereVersjoner,
				verdi: 'PT2729H38M17.206648844S',
			},
		],
	},
	{
		id: '2',
		felter: [
			{
				område: 'K9',
				kode: OppgavefilterKode.AkkumulertVentetidSaksbehandlerForTidligereVersjoner,
				verdi: 'PT6726H14M36.343829446S',
			},
		],
	},
	{
		id: '3',
		felter: [
			{
				område: 'K9',
				kode: OppgavefilterKode.AkkumulertVentetidSaksbehandlerForTidligereVersjoner,
				verdi: 'PT3073H46M51.467301321S',
			},
		],
	},
	{
		id: '4',
		felter: [
			{
				område: 'K9',
				kode: OppgavefilterKode.AkkumulertVentetidSaksbehandlerForTidligereVersjoner,
				verdi: 'PT7033H2M49.007959404S',
			},
		],
	},
	{
		id: '5',
		felter: [
			{
				område: 'K9',
				kode: OppgavefilterKode.AkkumulertVentetidSaksbehandlerForTidligereVersjoner,
				verdi: 'PT3718H26M1.401001181S',
			},
		],
	},
	{
		id: '6',
		felter: [
			{
				område: 'K9',
				kode: OppgavefilterKode.AkkumulertVentetidSaksbehandlerForTidligereVersjoner,
				verdi: 'PT2811H7M30.840869325S',
			},
		],
	},
	{
		id: '7',
		felter: [
			{
				område: 'K9',
				kode: OppgavefilterKode.AkkumulertVentetidSaksbehandlerForTidligereVersjoner,
				verdi: 'PT6647H44M16.82464825S',
			},
		],
	},
	{
		id: '8',
		felter: [
			{
				område: 'K9',
				kode: OppgavefilterKode.AkkumulertVentetidSaksbehandlerForTidligereVersjoner,
				verdi: 'PT4010H47M50.980515912S',
			},
		],
	},
	{
		id: '9',
		felter: [
			{
				område: 'K9',
				kode: OppgavefilterKode.AkkumulertVentetidSaksbehandlerForTidligereVersjoner,
				verdi: 'PT10198H6M33.2663571S',
			},
		],
	},
	{
		id: '10',
		felter: [
			{
				område: 'K9',
				kode: OppgavefilterKode.AkkumulertVentetidSaksbehandlerForTidligereVersjoner,
				verdi: 'PT4204H18M24.56699856S',
			},
		],
	},
];
export const oppgaveQueryForDate: IdentifiedOppgaveQuery = tilIdentifiedQuery({
	filtere: [
		{
			type: 'feltverdi',
			område: 'K9',
			kode: OppgavefilterKode.MottattDato,
			operator: 'NOT_EQUALS',
			verdi: ['2023-02-16T23:00:00.000Z'],
		},
	],
	select: [
		{
			type: 'enkel',
			område: 'K9',
			kode: OppgavefilterKode.MottattDato,
		},
	],
	order: [],
	limit: 10,
});
export const oppgaverMedDate: Oppgaverad[] = [
	{
		id: '1',
		felter: [
			{
				område: 'K9',
				kode: OppgavefilterKode.MottattDato,
				verdi: '2022-12-21T07:34:47.687703619',
			},
		],
	},
	{
		id: '2',
		felter: [
			{
				område: 'K9',
				kode: OppgavefilterKode.MottattDato,
				verdi: '2021-09-14T16:56:45.581289217',
			},
		],
	},
	{
		id: '3',
		felter: [
			{
				område: 'K9',
				kode: OppgavefilterKode.MottattDato,
				verdi: '2021-12-20T16:03:45.165071571',
			},
		],
	},
	{
		id: '4',
		felter: [
			{
				område: 'K9',
				kode: OppgavefilterKode.MottattDato,
				verdi: '2020-08-26T15:21:39.967493',
			},
		],
	},
	{
		id: '5',
		felter: [
			{
				område: 'K9',
				kode: OppgavefilterKode.MottattDato,
				verdi: '2022-12-25T12:36:34.953825956',
			},
		],
	},
	{
		id: '6',
		felter: [
			{
				område: 'K9',
				kode: OppgavefilterKode.MottattDato,
				verdi: '2021-06-21T13:05:58.255014246',
			},
		],
	},
	{
		id: '7',
		felter: [
			{
				område: 'K9',
				kode: OppgavefilterKode.MottattDato,
				verdi: '2022-12-24T14:30:00.958232203',
			},
		],
	},
	{
		id: '8',
		felter: [
			{
				område: 'K9',
				kode: OppgavefilterKode.MottattDato,
				verdi: '2021-01-20T14:08:50.047604',
			},
		],
	},
	{
		id: '9',
		felter: [
			{
				område: 'K9',
				kode: OppgavefilterKode.MottattDato,
				verdi: '2023-03-10T18:19:58.043496508',
			},
		],
	},
	{
		id: '10',
		felter: [
			{
				område: 'K9',
				kode: OppgavefilterKode.MottattDato,
				verdi: '2021-02-24T12:12:08.434053',
			},
		],
	},
];

export const felter: Oppgavefelt[] = [
	{
		område: 'K9',
		kode: OppgavefilterKode.AkkumulertVentetidAnnetForTidligereVersjoner,
		visningsnavn: 'Akkumulert ventetid annet for tidligere versjoner',
		tolkes_som: TolkesSom.Duration,
		kokriterie: false,
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: OppgavefilterKode.AkkumulertVentetidAnnetIkkeSaksbehandlingstidForTidligereVersjoner,
		visningsnavn: 'Akkumulert ventetid annet ikke saksbehandlingstid for tidligere versjoner',
		tolkes_som: TolkesSom.Duration,
		kokriterie: false,
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: OppgavefilterKode.AkkumulertVentetidArbeidsgiverForTidligereVersjoner,
		visningsnavn: 'Akkumulert ventetid arbeidsgiver for tidligere versjoner',
		tolkes_som: TolkesSom.Duration,
		kokriterie: false,
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: OppgavefilterKode.AkkumulertVentetidSaksbehandlerForTidligereVersjoner,
		visningsnavn: 'Akkumulert ventetid saksbehandler for tidligere versjoner',
		tolkes_som: TolkesSom.Duration,
		kokriterie: false,
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: OppgavefilterKode.AkkumulertVentetidSøkerForTidligereVersjoner,
		visningsnavn: 'Akkumulert ventetid søker for tidligere versjoner',
		tolkes_som: TolkesSom.Duration,
		kokriterie: false,
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: OppgavefilterKode.AkkumulertVentetidTekniskFeilForTidligereVersjoner,
		visningsnavn: 'Akkumulert ventetid teknisk feil for tidligere versjoner',
		tolkes_som: TolkesSom.Duration,
		kokriterie: false,
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: OppgavefilterKode.Aksjonspunkt,
		visningsnavn: 'Aksjonspunkt',
		tolkes_som: TolkesSom.String,
		kokriterie: false,
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: [
			{
				verdi: '5009',
				visningsnavn: 'Avklar tilleggsopplysninger',
				gruppering: undefined,
			},
			{
				verdi: '5015',
				visningsnavn: 'Foreslå vedtak',
				gruppering: undefined,
			},
			{
				verdi: '5016',
				visningsnavn: 'Fatter vedtak',
				gruppering: undefined,
			},
			{
				verdi: '5017',
				visningsnavn: 'Vurder søkers opplysningsplikt ved ufullstendig/ikke-komplett søknad',
				gruppering: undefined,
			},
			{
				verdi: '5018',
				visningsnavn: 'Foreslå vedtak uten totrinnskontroll',
				gruppering: undefined,
			},
			{
				verdi: '5019',
				visningsnavn: 'Avklar lovlig opphold.',
				gruppering: undefined,
			},
			{
				verdi: '5020',
				visningsnavn: 'Avklar om bruker er bosatt.',
				gruppering: undefined,
			},
			{
				verdi: '5021',
				visningsnavn: 'Avklar om bruker har gyldig periode.',
				gruppering: undefined,
			},
			{
				verdi: '5023',
				visningsnavn: 'Avklar oppholdsrett.',
				gruppering: undefined,
			},
			{
				verdi: '5026',
				visningsnavn: 'Varsel om revurdering opprettet manuelt',
				gruppering: undefined,
			},
			{
				verdi: '5028',
				visningsnavn: 'Foreslå vedtak manuelt',
				gruppering: undefined,
			},
			{
				verdi: '5030',
				visningsnavn: 'Avklar verge',
				gruppering: undefined,
			},
			{
				verdi: '5033',
				visningsnavn: 'Vurdere annen ytelse før vedtak',
				gruppering: undefined,
			},
			{
				verdi: '5034',
				visningsnavn: 'Vurdere dokument før vedtak',
				gruppering: undefined,
			},
			{
				verdi: '5040',
				visningsnavn: 'Vurdere overlappende ytelse før vedtak',
				gruppering: undefined,
			},
			{
				verdi: '5038',
				visningsnavn: 'Fastsette beregningsgrunnlag for arbeidstaker/frilanser skjønnsmessig',
				gruppering: undefined,
			},
			{
				verdi: '5039',
				visningsnavn: 'Vurder varig endret/nyoppstartet næring selvstendig næringsdrivende',
				gruppering: undefined,
			},
			{
				verdi: '5054',
				visningsnavn: 'Vurder varig endret/nyoppstartet næring selvstendig næringsdrivende',
				gruppering: undefined,
			},
			{
				verdi: '5042',
				visningsnavn: 'Fastsett beregningsgrunnlag for selvstendig næringsdrivende',
				gruppering: undefined,
			},
			{
				verdi: '5046',
				visningsnavn: 'Fordel beregningsgrunnlag',
				gruppering: undefined,
			},
			{
				verdi: '5067',
				visningsnavn: 'Fordel beregningsgrunnlag',
				gruppering: undefined,
			},
			{
				verdi: '5059',
				visningsnavn: 'Vurder refusjon beregningsgrunnlag',
				gruppering: undefined,
			},
			{
				verdi: '5047',
				visningsnavn: 'Fastsett beregningsgrunnlag for tidsbegrenset arbeidsforhold',
				gruppering: undefined,
			},
			{
				verdi: '5049',
				visningsnavn: 'Fastsett beregningsgrunnlag for SN som er ny i arbeidslivet',
				gruppering: undefined,
			},
			{
				verdi: '5050',
				visningsnavn: 'Vurder gradering på andel uten beregningsgrunnlag',
				gruppering: undefined,
			},
			{
				verdi: '5051',
				visningsnavn: 'Vurder perioder med opptjening',
				gruppering: undefined,
			},
			{
				verdi: '5052',
				visningsnavn: 'Avklar aktivitet for beregning',
				gruppering: undefined,
			},
			{
				verdi: '5053',
				visningsnavn: 'Avklar medlemskap.',
				gruppering: undefined,
			},
			{
				verdi: '5055',
				visningsnavn: 'Vurder varsel ved vedtak til ugunst',
				gruppering: undefined,
			},
			{
				verdi: '5056',
				visningsnavn: 'Kontroll av manuelt opprettet revurderingsbehandling',
				gruppering: undefined,
			},
			{
				verdi: '5057',
				visningsnavn: 'Manuell tilkjenning av ytelse',
				gruppering: undefined,
			},
			{
				verdi: '5058',
				visningsnavn: 'Vurder fakta for arbeidstaker, frilans og selvstendig næringsdrivende',
				gruppering: undefined,
			},
			{
				verdi: '5068',
				visningsnavn: 'Innhent dokumentasjon fra utenlandsk trygdemyndighet',
				gruppering: undefined,
			},
			{
				verdi: '5072',
				visningsnavn: 'Søker er stortingsrepresentant/administrativt ansatt i Stortinget',
				gruppering: undefined,
			},
			{
				verdi: '5080',
				visningsnavn: 'Avklar arbeidsforhold',
				gruppering: undefined,
			},
			{
				verdi: '5084',
				visningsnavn: 'Vurder feilutbetaling',
				gruppering: undefined,
			},
			{
				verdi: '5085',
				visningsnavn: 'Sjekk om ytelsesbehandlingen skal utføres før eller etter tilbakekrevingsbehandlingen',
				gruppering: undefined,
			},
			{
				verdi: '5089',
				visningsnavn: 'Manuell vurdering av opptjeningsvilkår',
				gruppering: undefined,
			},
			{
				verdi: '5090',
				visningsnavn: 'Vurder tilbaketrekk',
				gruppering: undefined,
			},
			{
				verdi: '5077',
				visningsnavn: 'Vurder søknadsfrist',
				gruppering: undefined,
			},
			{
				verdi: '9069',
				visningsnavn: 'Avklar om inntektsmeldinger kreves for å kunne beregne',
				gruppering: undefined,
			},
			{
				verdi: '9071',
				visningsnavn:
					'Endeling avklaring om inntektsmeldinger kreves for å kunne beregne eller om perioden skal avslås',
				gruppering: undefined,
			},
			{
				verdi: '6002',
				visningsnavn: 'Saksbehandler initierer kontroll av søkers opplysningsplikt',
				gruppering: undefined,
			},
			{
				verdi: '6005',
				visningsnavn: 'Overstyring av medlemskapsvilkåret',
				gruppering: undefined,
			},
			{
				verdi: '6006',
				visningsnavn: 'Overstyring av Søknadsfrist',
				gruppering: undefined,
			},
			{
				verdi: '6004',
				visningsnavn: 'Overstyring av medisinskvilkår for pleietrengende under 18 år',
				gruppering: undefined,
			},
			{
				verdi: '6008',
				visningsnavn: 'Overstyring av medisinskvilkår for pleietrengende 18 år',
				gruppering: undefined,
			},
			{
				verdi: '6003',
				visningsnavn: 'Overstyring av Omsorgen for',
				gruppering: undefined,
			},
			{
				verdi: '6007',
				visningsnavn: 'Overstyring av beregning',
				gruppering: undefined,
			},
			{
				verdi: '6011',
				visningsnavn: 'Overstyring av opptjeningsvilkåret',
				gruppering: undefined,
			},
			{
				verdi: '6014',
				visningsnavn: 'Overstyring av beregningsaktiviteter',
				gruppering: undefined,
			},
			{
				verdi: '6015',
				visningsnavn: 'Overstyring av beregningsgrunnlag',
				gruppering: undefined,
			},
			{
				verdi: '6016',
				visningsnavn: 'Overstyring av K9-vilkåret',
				gruppering: undefined,
			},
			{
				verdi: '6068',
				visningsnavn: 'Manuell markering av utenlandssak',
				gruppering: undefined,
			},
			{
				verdi: '7001',
				visningsnavn: 'Manuelt satt på vent',
				gruppering: undefined,
			},
			{
				verdi: '7003',
				visningsnavn: 'Venter på komplett søknad',
				gruppering: undefined,
			},
			{
				verdi: '7005',
				visningsnavn: 'Satt på vent etter varsel om revurdering',
				gruppering: undefined,
			},
			{
				verdi: '7006',
				visningsnavn: 'Venter på opptjeningsopplysninger',
				gruppering: undefined,
			},
			{
				verdi: '7008',
				visningsnavn: 'Satt på vent pga for tidlig søknad',
				gruppering: undefined,
			},
			{
				verdi: '7009',
				visningsnavn: 'Vent på oppdatering som passerer kompletthetssjekk',
				gruppering: undefined,
			},
			{
				verdi: '7014',
				visningsnavn: 'Vent på rapporteringsfrist for inntekt',
				gruppering: undefined,
			},
			{
				verdi: '7019',
				visningsnavn: 'Autopunkt gradering uten beregningsgrunnlag',
				gruppering: undefined,
			},
			{
				verdi: '7020',
				visningsnavn: 'Vent på siste meldekort for AAP eller DP-mottaker',
				gruppering: undefined,
			},
			{
				verdi: '7022',
				visningsnavn: 'Vent på ny inntektsmelding med gyldig arbeidsforholdId',
				gruppering: undefined,
			},
			{
				verdi: '7023',
				visningsnavn: 'Autopunkt militær i opptjeningsperioden og beregninggrunnlag under 3G',
				gruppering: undefined,
			},
			{
				verdi: '7025',
				visningsnavn: 'Autopunkt gradering flere arbeidsforhold',
				gruppering: undefined,
			},
			{
				verdi: '7030',
				visningsnavn: 'Vent på etterlyst inntektsmelding',
				gruppering: undefined,
			},
			{
				verdi: '7035',
				visningsnavn: 'Venter på manglende funksjonalitet, bruker 70år ved refusjonskrav',
				gruppering: undefined,
			},
			{
				verdi: '9068',
				visningsnavn: 'Vent på etterlyst inntektsmelding',
				gruppering: undefined,
			},
			{
				verdi: '9070',
				visningsnavn: 'Vent på etterlyst inntektsmelding og/eller tilsvar på varsel om avslag',
				gruppering: undefined,
			},
			{
				verdi: '7041',
				visningsnavn:
					'Vent på vedtak om lovendring vedrørende beregning av næring i kombinasjon med arbeid eller frilans',
				gruppering: undefined,
			},
			{
				verdi: '8000',
				visningsnavn: 'Venter på manglende funksjonalitet.',
				gruppering: undefined,
			},
			{
				verdi: '8003',
				visningsnavn: 'Venter på manglende funksjonalitet.',
				gruppering: undefined,
			},
			{
				verdi: '8005',
				visningsnavn: 'Arbeidstaker og frilanser i samme organisasjon, kan ikke beregnes.',
				gruppering: undefined,
			},
			{
				verdi: '8004',
				visningsnavn: 'Saksbehandler overstyrer oppgitt opptjening',
				gruppering: undefined,
			},
			{
				verdi: '9001',
				visningsnavn: 'Kontroller legeerklæring',
				gruppering: undefined,
			},
			{
				verdi: '9002',
				visningsnavn: 'Omsorgen for',
				gruppering: undefined,
			},
			{
				verdi: '9020',
				visningsnavn: 'Omsorgen for',
				gruppering: undefined,
			},
			{
				verdi: '9099',
				visningsnavn: 'Omsorgen for',
				gruppering: undefined,
			},
			{
				verdi: '9003',
				visningsnavn: 'Årskvantum',
				gruppering: undefined,
			},
			{
				verdi: '9004',
				visningsnavn: 'Årskvantum dokumentasjon',
				gruppering: undefined,
			},
			{
				verdi: '9013',
				visningsnavn: 'Utvidet Rett',
				gruppering: undefined,
			},
			{
				verdi: '9014',
				visningsnavn: 'Årskvantum',
				gruppering: undefined,
			},
			{
				verdi: '9015',
				visningsnavn: 'Vurder aldersvilkår barn',
				gruppering: undefined,
			},
			{
				verdi: '9005',
				visningsnavn: 'Overstyr input beregning',
				gruppering: undefined,
			},
			{
				verdi: '9006',
				visningsnavn: 'Venter på punsjet søknad',
				gruppering: undefined,
			},
			{
				verdi: '9007',
				visningsnavn: 'Mangler søknad for periode i inneværende år',
				gruppering: undefined,
			},
			{
				verdi: '9008',
				visningsnavn: 'Mangler søknad for annen parts periode',
				gruppering: undefined,
			},
			{
				verdi: '9200',
				visningsnavn: 'Vurder nattevåk og beredskap',
				gruppering: undefined,
			},
			{
				verdi: '9201',
				visningsnavn: 'Vurder nattevåk og beredskap',
				gruppering: undefined,
			},
			{
				verdi: '9202',
				visningsnavn: 'Vurder rett etter pleietrengendes død',
				gruppering: undefined,
			},
			{
				verdi: '9203',
				visningsnavn: 'Bruker har ikke oppgitt alle arbeidsgiverne sine',
				gruppering: undefined,
			},
			{
				verdi: '9290',
				visningsnavn:
					'En annen sak tilknyttet barnet må behandles frem til uttak, eller besluttes, før denne saken kan behandles videre.',
				gruppering: undefined,
			},
			{
				verdi: '9300',
				visningsnavn: 'Vurder om institusjonen er godkjent',
				gruppering: undefined,
			},
			{
				verdi: '9301',
				visningsnavn: 'Vurder om opplæringen er nødvendig for å behandle og ta seg av barnet',
				gruppering: undefined,
			},
			{
				verdi: '9302',
				visningsnavn: 'Vurder om opplæringen er gjennomgått',
				gruppering: undefined,
			},
			{
				verdi: '9303',
				visningsnavn: 'Vurder reisetid',
				gruppering: undefined,
			},
			{
				verdi: '9999',
				visningsnavn: 'Venter på manglende funksjonalitet.',
				gruppering: undefined,
			},
		],
	},
	{
		område: 'K9',
		kode: OppgavefilterKode.AktivVentefrist,
		visningsnavn: 'Aktiv ventefrist',
		tolkes_som: TolkesSom.Timestamp,
		kokriterie: false,
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: OppgavefilterKode.AktivVenteårsak,
		visningsnavn: 'Aktiv venteårsak',
		tolkes_som: TolkesSom.String,
		kokriterie: false,
		verdiforklaringerErUttømmende: true,
		verdiforklaringer: [
			{
				verdi: 'AVV_DOK',
				visningsnavn: 'Avventer dokumentasjon',
				gruppering: undefined,
			},
			{
				verdi: 'VENT_MANGL_FUNKSJ_SAKSBEHANDLER',
				visningsnavn: 'Manglende funksjonalitet i løsningen',
				gruppering: undefined,
			},
			{
				verdi: 'VENTER_SVAR_INTERNT',
				visningsnavn: 'Meldt i Porten eller Teams',
				gruppering: undefined,
			},
			{
				verdi: 'AUTOMATISK',
				visningsnavn: 'Automatisk satt på vent',
				gruppering: undefined,
			},
			{
				verdi: 'UKJENT',
				visningsnavn: 'Mangler venteårsak',
				gruppering: undefined,
			},
		],
	},
	{
		område: 'K9',
		kode: OppgavefilterKode.AktivtAksjonspunkt,
		visningsnavn: 'Aktivt aksjonspunkt',
		tolkes_som: TolkesSom.String,
		kokriterie: false,
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: [
			{
				verdi: '5009',
				visningsnavn: 'Avklar tilleggsopplysninger',
				gruppering: undefined,
			},
			{
				verdi: '5015',
				visningsnavn: 'Foreslå vedtak',
				gruppering: undefined,
			},
			{
				verdi: '5016',
				visningsnavn: 'Fatter vedtak',
				gruppering: undefined,
			},
			{
				verdi: '5017',
				visningsnavn: 'Vurder søkers opplysningsplikt ved ufullstendig/ikke-komplett søknad',
				gruppering: undefined,
			},
			{
				verdi: '5018',
				visningsnavn: 'Foreslå vedtak uten totrinnskontroll',
				gruppering: undefined,
			},
			{
				verdi: '5019',
				visningsnavn: 'Avklar lovlig opphold.',
				gruppering: undefined,
			},
			{
				verdi: '5020',
				visningsnavn: 'Avklar om bruker er bosatt.',
				gruppering: undefined,
			},
			{
				verdi: '5021',
				visningsnavn: 'Avklar om bruker har gyldig periode.',
				gruppering: undefined,
			},
			{
				verdi: '5023',
				visningsnavn: 'Avklar oppholdsrett.',
				gruppering: undefined,
			},
			{
				verdi: '5026',
				visningsnavn: 'Varsel om revurdering opprettet manuelt',
				gruppering: undefined,
			},
			{
				verdi: '5028',
				visningsnavn: 'Foreslå vedtak manuelt',
				gruppering: undefined,
			},
			{
				verdi: '5030',
				visningsnavn: 'Avklar verge',
				gruppering: undefined,
			},
			{
				verdi: '5033',
				visningsnavn: 'Vurdere annen ytelse før vedtak',
				gruppering: undefined,
			},
			{
				verdi: '5034',
				visningsnavn: 'Vurdere dokument før vedtak',
				gruppering: undefined,
			},
			{
				verdi: '5040',
				visningsnavn: 'Vurdere overlappende ytelse før vedtak',
				gruppering: undefined,
			},
			{
				verdi: '5038',
				visningsnavn: 'Fastsette beregningsgrunnlag for arbeidstaker/frilanser skjønnsmessig',
				gruppering: undefined,
			},
			{
				verdi: '5039',
				visningsnavn: 'Vurder varig endret/nyoppstartet næring selvstendig næringsdrivende',
				gruppering: undefined,
			},
			{
				verdi: '5054',
				visningsnavn: 'Vurder varig endret/nyoppstartet næring selvstendig næringsdrivende',
				gruppering: undefined,
			},
			{
				verdi: '5042',
				visningsnavn: 'Fastsett beregningsgrunnlag for selvstendig næringsdrivende',
				gruppering: undefined,
			},
			{
				verdi: '5046',
				visningsnavn: 'Fordel beregningsgrunnlag',
				gruppering: undefined,
			},
			{
				verdi: '5067',
				visningsnavn: 'Fordel beregningsgrunnlag',
				gruppering: undefined,
			},
			{
				verdi: '5059',
				visningsnavn: 'Vurder refusjon beregningsgrunnlag',
				gruppering: undefined,
			},
			{
				verdi: '5047',
				visningsnavn: 'Fastsett beregningsgrunnlag for tidsbegrenset arbeidsforhold',
				gruppering: undefined,
			},
			{
				verdi: '5049',
				visningsnavn: 'Fastsett beregningsgrunnlag for SN som er ny i arbeidslivet',
				gruppering: undefined,
			},
			{
				verdi: '5050',
				visningsnavn: 'Vurder gradering på andel uten beregningsgrunnlag',
				gruppering: undefined,
			},
			{
				verdi: '5051',
				visningsnavn: 'Vurder perioder med opptjening',
				gruppering: undefined,
			},
			{
				verdi: '5052',
				visningsnavn: 'Avklar aktivitet for beregning',
				gruppering: undefined,
			},
			{
				verdi: '5053',
				visningsnavn: 'Avklar medlemskap.',
				gruppering: undefined,
			},
			{
				verdi: '5055',
				visningsnavn: 'Vurder varsel ved vedtak til ugunst',
				gruppering: undefined,
			},
			{
				verdi: '5056',
				visningsnavn: 'Kontroll av manuelt opprettet revurderingsbehandling',
				gruppering: undefined,
			},
			{
				verdi: '5057',
				visningsnavn: 'Manuell tilkjenning av ytelse',
				gruppering: undefined,
			},
			{
				verdi: '5058',
				visningsnavn: 'Vurder fakta for arbeidstaker, frilans og selvstendig næringsdrivende',
				gruppering: undefined,
			},
			{
				verdi: '5068',
				visningsnavn: 'Innhent dokumentasjon fra utenlandsk trygdemyndighet',
				gruppering: undefined,
			},
			{
				verdi: '5072',
				visningsnavn: 'Søker er stortingsrepresentant/administrativt ansatt i Stortinget',
				gruppering: undefined,
			},
			{
				verdi: '5080',
				visningsnavn: 'Avklar arbeidsforhold',
				gruppering: undefined,
			},
			{
				verdi: '5084',
				visningsnavn: 'Vurder feilutbetaling',
				gruppering: undefined,
			},
			{
				verdi: '5085',
				visningsnavn: 'Sjekk om ytelsesbehandlingen skal utføres før eller etter tilbakekrevingsbehandlingen',
				gruppering: undefined,
			},
			{
				verdi: '5089',
				visningsnavn: 'Manuell vurdering av opptjeningsvilkår',
				gruppering: undefined,
			},
			{
				verdi: '5090',
				visningsnavn: 'Vurder tilbaketrekk',
				gruppering: undefined,
			},
			{
				verdi: '5077',
				visningsnavn: 'Vurder søknadsfrist',
				gruppering: undefined,
			},
			{
				verdi: '9069',
				visningsnavn: 'Avklar om inntektsmeldinger kreves for å kunne beregne',
				gruppering: undefined,
			},
			{
				verdi: '9071',
				visningsnavn:
					'Endeling avklaring om inntektsmeldinger kreves for å kunne beregne eller om perioden skal avslås',
				gruppering: undefined,
			},
			{
				verdi: '6002',
				visningsnavn: 'Saksbehandler initierer kontroll av søkers opplysningsplikt',
				gruppering: undefined,
			},
			{
				verdi: '6005',
				visningsnavn: 'Overstyring av medlemskapsvilkåret',
				gruppering: undefined,
			},
			{
				verdi: '6006',
				visningsnavn: 'Overstyring av Søknadsfrist',
				gruppering: undefined,
			},
			{
				verdi: '6004',
				visningsnavn: 'Overstyring av medisinskvilkår for pleietrengende under 18 år',
				gruppering: undefined,
			},
			{
				verdi: '6008',
				visningsnavn: 'Overstyring av medisinskvilkår for pleietrengende 18 år',
				gruppering: undefined,
			},
			{
				verdi: '6003',
				visningsnavn: 'Overstyring av Omsorgen for',
				gruppering: undefined,
			},
			{
				verdi: '6007',
				visningsnavn: 'Overstyring av beregning',
				gruppering: undefined,
			},
			{
				verdi: '6011',
				visningsnavn: 'Overstyring av opptjeningsvilkåret',
				gruppering: undefined,
			},
			{
				verdi: '6014',
				visningsnavn: 'Overstyring av beregningsaktiviteter',
				gruppering: undefined,
			},
			{
				verdi: '6015',
				visningsnavn: 'Overstyring av beregningsgrunnlag',
				gruppering: undefined,
			},
			{
				verdi: '6016',
				visningsnavn: 'Overstyring av K9-vilkåret',
				gruppering: undefined,
			},
			{
				verdi: '6068',
				visningsnavn: 'Manuell markering av utenlandssak',
				gruppering: undefined,
			},
			{
				verdi: '7001',
				visningsnavn: 'Manuelt satt på vent',
				gruppering: undefined,
			},
			{
				verdi: '7003',
				visningsnavn: 'Venter på komplett søknad',
				gruppering: undefined,
			},
			{
				verdi: '7005',
				visningsnavn: 'Satt på vent etter varsel om revurdering',
				gruppering: undefined,
			},
			{
				verdi: '7006',
				visningsnavn: 'Venter på opptjeningsopplysninger',
				gruppering: undefined,
			},
			{
				verdi: '7008',
				visningsnavn: 'Satt på vent pga for tidlig søknad',
				gruppering: undefined,
			},
			{
				verdi: '7009',
				visningsnavn: 'Vent på oppdatering som passerer kompletthetssjekk',
				gruppering: undefined,
			},
			{
				verdi: '7014',
				visningsnavn: 'Vent på rapporteringsfrist for inntekt',
				gruppering: undefined,
			},
			{
				verdi: '7019',
				visningsnavn: 'Autopunkt gradering uten beregningsgrunnlag',
				gruppering: undefined,
			},
			{
				verdi: '7020',
				visningsnavn: 'Vent på siste meldekort for AAP eller DP-mottaker',
				gruppering: undefined,
			},
			{
				verdi: '7022',
				visningsnavn: 'Vent på ny inntektsmelding med gyldig arbeidsforholdId',
				gruppering: undefined,
			},
			{
				verdi: '7023',
				visningsnavn: 'Autopunkt militær i opptjeningsperioden og beregninggrunnlag under 3G',
				gruppering: undefined,
			},
			{
				verdi: '7025',
				visningsnavn: 'Autopunkt gradering flere arbeidsforhold',
				gruppering: undefined,
			},
			{
				verdi: '7030',
				visningsnavn: 'Vent på etterlyst inntektsmelding',
				gruppering: undefined,
			},
			{
				verdi: '7035',
				visningsnavn: 'Venter på manglende funksjonalitet, bruker 70år ved refusjonskrav',
				gruppering: undefined,
			},
			{
				verdi: '9068',
				visningsnavn: 'Vent på etterlyst inntektsmelding',
				gruppering: undefined,
			},
			{
				verdi: '9070',
				visningsnavn: 'Vent på etterlyst inntektsmelding og/eller tilsvar på varsel om avslag',
				gruppering: undefined,
			},
			{
				verdi: '7041',
				visningsnavn:
					'Vent på vedtak om lovendring vedrørende beregning av næring i kombinasjon med arbeid eller frilans',
				gruppering: undefined,
			},
			{
				verdi: '8000',
				visningsnavn: 'Venter på manglende funksjonalitet.',
				gruppering: undefined,
			},
			{
				verdi: '8003',
				visningsnavn: 'Venter på manglende funksjonalitet.',
				gruppering: undefined,
			},
			{
				verdi: '8005',
				visningsnavn: 'Arbeidstaker og frilanser i samme organisasjon, kan ikke beregnes.',
				gruppering: undefined,
			},
			{
				verdi: '8004',
				visningsnavn: 'Saksbehandler overstyrer oppgitt opptjening',
				gruppering: undefined,
			},
			{
				verdi: '9001',
				visningsnavn: 'Kontroller legeerklæring',
				gruppering: undefined,
			},
			{
				verdi: '9002',
				visningsnavn: 'Omsorgen for',
				gruppering: undefined,
			},
			{
				verdi: '9020',
				visningsnavn: 'Omsorgen for',
				gruppering: undefined,
			},
			{
				verdi: '9099',
				visningsnavn: 'Omsorgen for',
				gruppering: undefined,
			},
			{
				verdi: '9003',
				visningsnavn: 'Årskvantum',
				gruppering: undefined,
			},
			{
				verdi: '9004',
				visningsnavn: 'Årskvantum dokumentasjon',
				gruppering: undefined,
			},
			{
				verdi: '9013',
				visningsnavn: 'Utvidet Rett',
				gruppering: undefined,
			},
			{
				verdi: '9014',
				visningsnavn: 'Årskvantum',
				gruppering: undefined,
			},
			{
				verdi: '9015',
				visningsnavn: 'Vurder aldersvilkår barn',
				gruppering: undefined,
			},
			{
				verdi: '9005',
				visningsnavn: 'Overstyr input beregning',
				gruppering: undefined,
			},
			{
				verdi: '9006',
				visningsnavn: 'Venter på punsjet søknad',
				gruppering: undefined,
			},
			{
				verdi: '9007',
				visningsnavn: 'Mangler søknad for periode i inneværende år',
				gruppering: undefined,
			},
			{
				verdi: '9008',
				visningsnavn: 'Mangler søknad for annen parts periode',
				gruppering: undefined,
			},
			{
				verdi: '9200',
				visningsnavn: 'Vurder nattevåk og beredskap',
				gruppering: undefined,
			},
			{
				verdi: '9201',
				visningsnavn: 'Vurder nattevåk og beredskap',
				gruppering: undefined,
			},
			{
				verdi: '9202',
				visningsnavn: 'Vurder rett etter pleietrengendes død',
				gruppering: undefined,
			},
			{
				verdi: '9203',
				visningsnavn: 'Bruker har ikke oppgitt alle arbeidsgiverne sine',
				gruppering: undefined,
			},
			{
				verdi: '9290',
				visningsnavn:
					'En annen sak tilknyttet barnet må behandles frem til uttak, eller besluttes, før denne saken kan behandles videre.',
				gruppering: undefined,
			},
			{
				verdi: '9300',
				visningsnavn: 'Vurder om institusjonen er godkjent',
				gruppering: undefined,
			},
			{
				verdi: '9301',
				visningsnavn: 'Vurder om opplæringen er nødvendig for å behandle og ta seg av barnet',
				gruppering: undefined,
			},
			{
				verdi: '9302',
				visningsnavn: 'Vurder om opplæringen er gjennomgått',
				gruppering: undefined,
			},
			{
				verdi: '9303',
				visningsnavn: 'Vurder reisetid',
				gruppering: undefined,
			},
			{
				verdi: '9999',
				visningsnavn: 'Venter på manglende funksjonalitet.',
				gruppering: undefined,
			},
		],
	},
	{
		område: 'K9',
		kode: OppgavefilterKode.AktorId,
		visningsnavn: 'Aktor id',
		tolkes_som: TolkesSom.String,
		kokriterie: false,
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: OppgavefilterKode.AnsvarligBeslutter,
		visningsnavn: 'Ansvarlig beslutter',
		tolkes_som: TolkesSom.String,
		kokriterie: false,
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: OppgavefilterKode.AnsvarligSaksbehandler,
		visningsnavn: 'Ansvarlig saksbehandler',
		tolkes_som: TolkesSom.String,
		kokriterie: false,
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: OppgavefilterKode.AvventerAnnet,
		visningsnavn: 'Avventer annet',
		tolkes_som: TolkesSom.Boolean,
		kokriterie: false,
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: OppgavefilterKode.AvventerAnnetIkkeSaksbehandlingstid,
		visningsnavn: 'Avventer annet ikke saksbehandlingstid',
		tolkes_som: TolkesSom.Boolean,
		kokriterie: false,
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: OppgavefilterKode.AvventerArbeidsgiver,
		visningsnavn: 'Avventer arbeidsgiver',
		tolkes_som: TolkesSom.Boolean,
		kokriterie: false,
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: OppgavefilterKode.AvventerSaksbehandler,
		visningsnavn: 'Avventer saksbehandler',
		tolkes_som: TolkesSom.Boolean,
		kokriterie: false,
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: OppgavefilterKode.AvventerSøker,
		visningsnavn: 'Avventer søker',
		tolkes_som: TolkesSom.Boolean,
		kokriterie: false,
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: OppgavefilterKode.AvventerTekniskFeil,
		visningsnavn: 'Avventer teknisk feil',
		tolkes_som: TolkesSom.Boolean,
		kokriterie: false,
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: OppgavefilterKode.BehandlendeEnhet,
		visningsnavn: 'Behandlende enhet',
		tolkes_som: TolkesSom.String,
		kokriterie: false,
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: OppgavefilterKode.BehandlingTypekode,
		visningsnavn: 'Behandling typekode',
		tolkes_som: TolkesSom.String,
		kokriterie: false,
		verdiforklaringerErUttømmende: true,
		verdiforklaringer: [
			{
				verdi: 'BT-002',
				visningsnavn: 'Førstegangsbehandling',
				gruppering: undefined,
			},
			{
				verdi: 'BT-003',
				visningsnavn: 'Klage',
				gruppering: undefined,
			},
			{
				verdi: 'BT-004',
				visningsnavn: 'Revurdering',
				gruppering: undefined,
			},
			{
				verdi: 'BT-006',
				visningsnavn: 'Innsyn',
				gruppering: undefined,
			},
			{
				verdi: 'BT-007',
				visningsnavn: 'Tilbakekreving',
				gruppering: undefined,
			},
			{
				verdi: 'BT-008',
				visningsnavn: 'Anke',
				gruppering: undefined,
			},
			{
				verdi: 'BT-009',
				visningsnavn: 'Tilbakekreving revurdering',
				gruppering: undefined,
			},
			{
				verdi: 'BT-010',
				visningsnavn: 'Unntaksbehandling',
				gruppering: undefined,
			},
			{
				verdi: 'PAPIRSØKNAD',
				visningsnavn: 'Papirsøknad',
				gruppering: undefined,
			},
			{
				verdi: 'PAPIRETTERSENDELSE',
				visningsnavn: 'Papirettersendelse',
				gruppering: undefined,
			},
			{
				verdi: 'PAPIRINNTEKTSOPPLYSNINGER',
				visningsnavn: 'Papirinntektsopplysninger',
				gruppering: undefined,
			},
			{
				verdi: 'DIGITAL_ETTERSENDELSE',
				visningsnavn: 'Digital ettersendelse',
				gruppering: undefined,
			},
			{
				verdi: 'INNLOGGET_CHAT',
				visningsnavn: 'Innlogget chat',
				gruppering: undefined,
			},
			{
				verdi: 'SKRIV_TIL_OSS_SPØRMSÅL',
				visningsnavn: 'Skriv til oss spørsmål',
				gruppering: undefined,
			},
			{
				verdi: 'SKRIV_TIL_OSS_SVAR',
				visningsnavn: 'Skriv til oss svar',
				gruppering: undefined,
			},
			{
				verdi: 'SAMTALEREFERAT',
				visningsnavn: 'Samtalereferat',
				gruppering: undefined,
			},
			{
				verdi: 'KOPI',
				visningsnavn: 'Kopi',
				gruppering: undefined,
			},
			{
				verdi: 'INNTEKTSMELDING_UTGÅTT',
				visningsnavn: 'Inntektsmeldinger uten søknad',
				gruppering: undefined,
			},
			{
				verdi: 'UTEN_FNR_DNR',
				visningsnavn: 'Uten fnr eller dnr',
				gruppering: undefined,
			},
			{
				verdi: 'UKJENT',
				visningsnavn: 'Ukjent',
				gruppering: undefined,
			},
		],
	},
	{
		område: 'K9',
		kode: OppgavefilterKode.BehandlingUuid,
		visningsnavn: 'Behandling uuid',
		tolkes_som: TolkesSom.String,
		kokriterie: false,
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: OppgavefilterKode.Behandlingsstatus,
		visningsnavn: 'Behandlingsstatus',
		tolkes_som: TolkesSom.String,
		kokriterie: false,
		verdiforklaringerErUttømmende: true,
		verdiforklaringer: [
			{
				verdi: 'AVSLU',
				visningsnavn: 'Avsluttet',
				gruppering: undefined,
			},
			{
				verdi: 'FVED',
				visningsnavn: 'Fatter vedtak',
				gruppering: undefined,
			},
			{
				verdi: 'IVED',
				visningsnavn: 'Iverksetter vedtak',
				gruppering: undefined,
			},
			{
				verdi: 'OPPRE',
				visningsnavn: 'Opprettet',
				gruppering: undefined,
			},
			{
				verdi: 'UTRED',
				visningsnavn: 'Utredes',
				gruppering: undefined,
			},
			{
				verdi: 'VENT',
				visningsnavn: 'Satt på vent',
				gruppering: undefined,
			},
			{
				verdi: 'LUKKET',
				visningsnavn: 'Lukket',
				gruppering: undefined,
			},
			{
				verdi: 'SENDT_INN',
				visningsnavn: 'Sendt inn',
				gruppering: undefined,
			},
		],
	},
	{
		område: 'K9',
		kode: OppgavefilterKode.Behandlingssteg,
		visningsnavn: 'Behandlingssteg',
		tolkes_som: TolkesSom.String,
		kokriterie: false,
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: [
			{
				verdi: 'BERYT',
				visningsnavn: 'Beregn ytelse',
				gruppering: undefined,
			},
			{
				verdi: 'PRECONDITION_BERGRUNN',
				visningsnavn: 'Vurderer om det er mulig å beregne',
				gruppering: undefined,
			},
			{
				verdi: 'FAST_BERGRUNN',
				visningsnavn: 'Fastsett beregningsgrunnlag',
				gruppering: undefined,
			},
			{
				verdi: 'VURDER_OPPTJ_PERIODE',
				visningsnavn: 'Vurder Opptjening Periode',
				gruppering: undefined,
			},
			{
				verdi: 'FASTSETT_STP_BER',
				visningsnavn: 'Fastsett skjæringstidspunkt beregning',
				gruppering: undefined,
			},
			{
				verdi: 'FVEDSTEG',
				visningsnavn: 'Fatte Vedtak',
				gruppering: undefined,
			},
			{
				verdi: 'VURDER_VILKAR_BERGRUNN',
				visningsnavn: 'Vurder beregingsgrunnlagsvilkåret',
				gruppering: undefined,
			},
			{
				verdi: 'VURDER_REF_BERGRUNN',
				visningsnavn: 'Vurder refusjon for beregningsgrunnlaget',
				gruppering: undefined,
			},
			{
				verdi: 'FORDEL_BERGRUNN',
				visningsnavn: 'Fordel beregningsgrunnlag',
				gruppering: undefined,
			},
			{
				verdi: 'FORBRES',
				visningsnavn: 'Foreslå behandlingsresultat',
				gruppering: undefined,
			},
			{
				verdi: 'FORS_BERGRUNN',
				visningsnavn: 'Foreslå beregningsgrunnlag',
				gruppering: undefined,
			},
			{
				verdi: 'FORS_BERGRUNN_2',
				visningsnavn: 'Foreslå beregningsgrunnlag del 2',
				gruppering: undefined,
			},
			{
				verdi: 'VURDER_MANUELT_BREV',
				visningsnavn: 'Vurder manuelt brev',
				gruppering: undefined,
			},
			{
				verdi: 'FORVEDSTEG',
				visningsnavn: 'Foreslå vedtak',
				gruppering: undefined,
			},
			{
				verdi: 'BERYT_OPPDRAG',
				visningsnavn: 'Hindre tilbaketrekk',
				gruppering: undefined,
			},
			{
				verdi: 'VURDER_SØKNADSFRIST',
				visningsnavn: 'Vurder søknadsfrist',
				gruppering: undefined,
			},
			{
				verdi: 'INIT_PERIODER',
				visningsnavn: 'Start',
				gruppering: undefined,
			},
			{
				verdi: 'INIT_VILKÅR',
				visningsnavn: 'Initier vilkår for behandling',
				gruppering: undefined,
			},
			{
				verdi: 'INPER',
				visningsnavn: 'Innhent personopplysninger',
				gruppering: undefined,
			},
			{
				verdi: 'INREG',
				visningsnavn: 'Innhent registeropplysninger - innledende oppgaver',
				gruppering: undefined,
			},
			{
				verdi: 'INSØK',
				visningsnavn: 'Innhent søknadsopplysninger',
				gruppering: undefined,
			},
			{
				verdi: 'INREG_AVSL',
				visningsnavn: 'Innhent registeropplysninger - resterende oppgaver',
				gruppering: undefined,
			},
			{
				verdi: 'IVEDSTEG',
				visningsnavn: 'Iverksett Vedtak',
				gruppering: undefined,
			},
			{
				verdi: 'KOFAK',
				visningsnavn: 'Kontroller Fakta',
				gruppering: undefined,
			},
			{
				verdi: 'KOARB',
				visningsnavn: 'Kontroller arbeidsforhold',
				gruppering: undefined,
			},
			{
				verdi: 'KOMPLETT_FOR_BEREGNING',
				visningsnavn: 'Opplysninger til beregning',
				gruppering: undefined,
			},
			{
				verdi: 'KOFAKBER',
				visningsnavn: 'Kontroller fakta for beregning',
				gruppering: undefined,
			},
			{
				verdi: 'KOFAKUT',
				visningsnavn: 'Kontroller fakta for uttak',
				gruppering: undefined,
			},
			{
				verdi: 'KOFAK_LOP_MEDL',
				visningsnavn: 'Kontroller løpende medlemskap',
				gruppering: undefined,
			},
			{
				verdi: 'VURDEROP',
				visningsnavn: 'Kontrollerer søkers opplysningsplikt',
				gruppering: undefined,
			},
			{
				verdi: 'SIMOPP',
				visningsnavn: 'Simuler oppdrag',
				gruppering: undefined,
			},
			{
				verdi: 'START',
				visningsnavn: 'Start behandling prosess',
				gruppering: undefined,
			},
			{
				verdi: 'VRSLREV',
				visningsnavn: 'Varsel om revurdering',
				gruppering: undefined,
			},
			{
				verdi: 'VULOMED',
				visningsnavn: 'Vurder løpende medlemskap',
				gruppering: undefined,
			},
			{
				verdi: 'VURDER_FARESIGNALER',
				visningsnavn: 'Vurder faresignaler',
				gruppering: undefined,
			},
			{
				verdi: 'VURDINNSYN',
				visningsnavn: 'Vurder innsynskrav',
				gruppering: undefined,
			},
			{
				verdi: 'VURDERKOMPLETT',
				visningsnavn: 'Vurder kompletthet',
				gruppering: undefined,
			},
			{
				verdi: 'POSTCONDITION_KOMPLETTHET',
				visningsnavn: 'Sjekker om det er mulig å fortsette etter kompletthetssjekk',
				gruppering: undefined,
			},
			{
				verdi: 'VARIANT_FILTER',
				visningsnavn: 'Filtrer ut varianter',
				gruppering: undefined,
			},
			{
				verdi: 'VURDER_MEDISINSK',
				visningsnavn: 'Vurder medisinske vilkår',
				gruppering: undefined,
			},
			{
				verdi: 'VURDER_NODVENDIGHET',
				visningsnavn: 'Vurder nødvendighetens vilkår',
				gruppering: undefined,
			},
			{
				verdi: 'VURDER_INSTITUSJON',
				visningsnavn: 'Vurder krav til institusjonen',
				gruppering: undefined,
			},
			{
				verdi: 'VURDER_GJENNOMGATT_OPPLAERING',
				visningsnavn: 'Vurder gjennomgått opplæring',
				gruppering: undefined,
			},
			{
				verdi: 'POST_MEDISINSK',
				visningsnavn: 'Post vurder medisinskvilkår',
				gruppering: undefined,
			},
			{
				verdi: 'VURDERMV',
				visningsnavn: 'Vurder medlemskapvilkår',
				gruppering: undefined,
			},
			{
				verdi: 'VURDER_OMSORG_FOR',
				visningsnavn: 'Vurder omsorgen for',
				gruppering: undefined,
			},
			{
				verdi: 'VURDER_ALDER',
				visningsnavn: 'Vurder søkers alder',
				gruppering: undefined,
			},
			{
				verdi: 'VURDER_ALDER_BARN',
				visningsnavn: 'Vurder barnets alder',
				gruppering: undefined,
			},
			{
				verdi: 'VURDER_OPPTJ_FAKTA',
				visningsnavn: 'Vurder opptjeningfakta',
				gruppering: undefined,
			},
			{
				verdi: 'VURDER_OPPTJ',
				visningsnavn: 'Vurder opptjeningsvilkåret',
				gruppering: undefined,
			},
			{
				verdi: 'VURDER_TILBAKETREKK',
				visningsnavn: 'Vurder tilbaketrekk',
				gruppering: undefined,
			},
			{
				verdi: 'VURDER_UTLAND',
				visningsnavn: 'Vurder utland (SED)',
				gruppering: undefined,
			},
			{
				verdi: 'VURDER_UTTAK',
				visningsnavn: 'Vurder uttaksvilkår',
				gruppering: undefined,
			},
			{
				verdi: 'VURDER_UTTAK_V2',
				visningsnavn: 'Uttak',
				gruppering: undefined,
			},
			{
				verdi: 'BEKREFT_UTTAK',
				visningsnavn: 'Bekreft uttak',
				gruppering: undefined,
			},
			{
				verdi: 'MANUELL_VILKÅRSVURDERING',
				visningsnavn: 'Manuell vilkårsvurdering',
				gruppering: undefined,
			},
			{
				verdi: 'MANUELL_TILKJENNING_YTELSE',
				visningsnavn: 'Manuell tilkjenning av ytelse',
				gruppering: undefined,
			},
			{
				verdi: 'OVERGANG_FRA_INFOTRYGD',
				visningsnavn: 'Direkte overgang fra infotrygd',
				gruppering: undefined,
			},
		],
	},
	{
		område: 'K9',
		kode: OppgavefilterKode.Fagsystem,
		visningsnavn: 'Fagsystem',
		tolkes_som: TolkesSom.String,
		kokriterie: false,
		verdiforklaringerErUttømmende: true,
		verdiforklaringer: [
			{
				verdi: 'K9SAK',
				visningsnavn: 'K9-sak',
				gruppering: undefined,
			},
			{
				verdi: 'K9TILBAKE',
				visningsnavn: 'K9-tilbake',
				gruppering: undefined,
			},
			{
				verdi: 'FPTILBAKE',
				visningsnavn: 'FP-tilbake',
				gruppering: undefined,
			},
			{
				verdi: 'PUNSJ',
				visningsnavn: 'K9-punsj',
				gruppering: undefined,
			},
			{
				verdi: 'OMSORGSPENGER',
				visningsnavn: 'Omsorgspenger',
				gruppering: undefined,
			},
		],
	},
	{
		område: 'K9',
		kode: OppgavefilterKode.FraEndringsdialog,
		visningsnavn: 'Fra endringsdialog',
		tolkes_som: TolkesSom.Boolean,
		kokriterie: false,
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: OppgavefilterKode.Hastesak,
		visningsnavn: 'Hastesak',
		tolkes_som: TolkesSom.Boolean,
		kokriterie: false,
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: OppgavefilterKode.HelautomatiskBehandlet,
		visningsnavn: 'Helautomatisk behandlet',
		tolkes_som: TolkesSom.Boolean,
		kokriterie: false,
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: OppgavefilterKode.LøsbartAksjonspunkt,
		visningsnavn: 'Aksjonspunkt som kan løses',
		tolkes_som: TolkesSom.String,
		kokriterie: false,
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: [
			{
				verdi: '5009',
				visningsnavn: 'Avklar tilleggsopplysninger',
				gruppering: undefined,
			},
			{
				verdi: '5015',
				visningsnavn: 'Foreslå vedtak',
				gruppering: undefined,
			},
			{
				verdi: '5016',
				visningsnavn: 'Fatter vedtak',
				gruppering: undefined,
			},
			{
				verdi: '5017',
				visningsnavn: 'Vurder søkers opplysningsplikt ved ufullstendig/ikke-komplett søknad',
				gruppering: undefined,
			},
			{
				verdi: '5018',
				visningsnavn: 'Foreslå vedtak uten totrinnskontroll',
				gruppering: undefined,
			},
			{
				verdi: '5019',
				visningsnavn: 'Avklar lovlig opphold.',
				gruppering: undefined,
			},
			{
				verdi: '5020',
				visningsnavn: 'Avklar om bruker er bosatt.',
				gruppering: undefined,
			},
			{
				verdi: '5021',
				visningsnavn: 'Avklar om bruker har gyldig periode.',
				gruppering: undefined,
			},
			{
				verdi: '5023',
				visningsnavn: 'Avklar oppholdsrett.',
				gruppering: undefined,
			},
			{
				verdi: '5026',
				visningsnavn: 'Varsel om revurdering opprettet manuelt',
				gruppering: undefined,
			},
			{
				verdi: '5028',
				visningsnavn: 'Foreslå vedtak manuelt',
				gruppering: undefined,
			},
			{
				verdi: '5030',
				visningsnavn: 'Avklar verge',
				gruppering: undefined,
			},
			{
				verdi: '5033',
				visningsnavn: 'Vurdere annen ytelse før vedtak',
				gruppering: undefined,
			},
			{
				verdi: '5034',
				visningsnavn: 'Vurdere dokument før vedtak',
				gruppering: undefined,
			},
			{
				verdi: '5040',
				visningsnavn: 'Vurdere overlappende ytelse før vedtak',
				gruppering: undefined,
			},
			{
				verdi: '5038',
				visningsnavn: 'Fastsette beregningsgrunnlag for arbeidstaker/frilanser skjønnsmessig',
				gruppering: undefined,
			},
			{
				verdi: '5039',
				visningsnavn: 'Vurder varig endret/nyoppstartet næring selvstendig næringsdrivende',
				gruppering: undefined,
			},
			{
				verdi: '5054',
				visningsnavn: 'Vurder varig endret/nyoppstartet næring selvstendig næringsdrivende',
				gruppering: undefined,
			},
			{
				verdi: '5042',
				visningsnavn: 'Fastsett beregningsgrunnlag for selvstendig næringsdrivende',
				gruppering: undefined,
			},
			{
				verdi: '5046',
				visningsnavn: 'Fordel beregningsgrunnlag',
				gruppering: undefined,
			},
			{
				verdi: '5067',
				visningsnavn: 'Fordel beregningsgrunnlag',
				gruppering: undefined,
			},
			{
				verdi: '5059',
				visningsnavn: 'Vurder refusjon beregningsgrunnlag',
				gruppering: undefined,
			},
			{
				verdi: '5047',
				visningsnavn: 'Fastsett beregningsgrunnlag for tidsbegrenset arbeidsforhold',
				gruppering: undefined,
			},
			{
				verdi: '5049',
				visningsnavn: 'Fastsett beregningsgrunnlag for SN som er ny i arbeidslivet',
				gruppering: undefined,
			},
			{
				verdi: '5050',
				visningsnavn: 'Vurder gradering på andel uten beregningsgrunnlag',
				gruppering: undefined,
			},
			{
				verdi: '5051',
				visningsnavn: 'Vurder perioder med opptjening',
				gruppering: undefined,
			},
			{
				verdi: '5052',
				visningsnavn: 'Avklar aktivitet for beregning',
				gruppering: undefined,
			},
			{
				verdi: '5053',
				visningsnavn: 'Avklar medlemskap.',
				gruppering: undefined,
			},
			{
				verdi: '5055',
				visningsnavn: 'Vurder varsel ved vedtak til ugunst',
				gruppering: undefined,
			},
			{
				verdi: '5056',
				visningsnavn: 'Kontroll av manuelt opprettet revurderingsbehandling',
				gruppering: undefined,
			},
			{
				verdi: '5057',
				visningsnavn: 'Manuell tilkjenning av ytelse',
				gruppering: undefined,
			},
			{
				verdi: '5058',
				visningsnavn: 'Vurder fakta for arbeidstaker, frilans og selvstendig næringsdrivende',
				gruppering: undefined,
			},
			{
				verdi: '5068',
				visningsnavn: 'Innhent dokumentasjon fra utenlandsk trygdemyndighet',
				gruppering: undefined,
			},
			{
				verdi: '5072',
				visningsnavn: 'Søker er stortingsrepresentant/administrativt ansatt i Stortinget',
				gruppering: undefined,
			},
			{
				verdi: '5080',
				visningsnavn: 'Avklar arbeidsforhold',
				gruppering: undefined,
			},
			{
				verdi: '5084',
				visningsnavn: 'Vurder feilutbetaling',
				gruppering: undefined,
			},
			{
				verdi: '5085',
				visningsnavn: 'Sjekk om ytelsesbehandlingen skal utføres før eller etter tilbakekrevingsbehandlingen',
				gruppering: undefined,
			},
			{
				verdi: '5089',
				visningsnavn: 'Manuell vurdering av opptjeningsvilkår',
				gruppering: undefined,
			},
			{
				verdi: '5090',
				visningsnavn: 'Vurder tilbaketrekk',
				gruppering: undefined,
			},
			{
				verdi: '5077',
				visningsnavn: 'Vurder søknadsfrist',
				gruppering: undefined,
			},
			{
				verdi: '9069',
				visningsnavn: 'Avklar om inntektsmeldinger kreves for å kunne beregne',
				gruppering: undefined,
			},
			{
				verdi: '9071',
				visningsnavn:
					'Endeling avklaring om inntektsmeldinger kreves for å kunne beregne eller om perioden skal avslås',
				gruppering: undefined,
			},
			{
				verdi: '6002',
				visningsnavn: 'Saksbehandler initierer kontroll av søkers opplysningsplikt',
				gruppering: undefined,
			},
			{
				verdi: '6005',
				visningsnavn: 'Overstyring av medlemskapsvilkåret',
				gruppering: undefined,
			},
			{
				verdi: '6006',
				visningsnavn: 'Overstyring av Søknadsfrist',
				gruppering: undefined,
			},
			{
				verdi: '6004',
				visningsnavn: 'Overstyring av medisinskvilkår for pleietrengende under 18 år',
				gruppering: undefined,
			},
			{
				verdi: '6008',
				visningsnavn: 'Overstyring av medisinskvilkår for pleietrengende 18 år',
				gruppering: undefined,
			},
			{
				verdi: '6003',
				visningsnavn: 'Overstyring av Omsorgen for',
				gruppering: undefined,
			},
			{
				verdi: '6007',
				visningsnavn: 'Overstyring av beregning',
				gruppering: undefined,
			},
			{
				verdi: '6011',
				visningsnavn: 'Overstyring av opptjeningsvilkåret',
				gruppering: undefined,
			},
			{
				verdi: '6014',
				visningsnavn: 'Overstyring av beregningsaktiviteter',
				gruppering: undefined,
			},
			{
				verdi: '6015',
				visningsnavn: 'Overstyring av beregningsgrunnlag',
				gruppering: undefined,
			},
			{
				verdi: '6016',
				visningsnavn: 'Overstyring av K9-vilkåret',
				gruppering: undefined,
			},
			{
				verdi: '6068',
				visningsnavn: 'Manuell markering av utenlandssak',
				gruppering: undefined,
			},
			{
				verdi: '7001',
				visningsnavn: 'Manuelt satt på vent',
				gruppering: undefined,
			},
			{
				verdi: '7003',
				visningsnavn: 'Venter på komplett søknad',
				gruppering: undefined,
			},
			{
				verdi: '7005',
				visningsnavn: 'Satt på vent etter varsel om revurdering',
				gruppering: undefined,
			},
			{
				verdi: '7006',
				visningsnavn: 'Venter på opptjeningsopplysninger',
				gruppering: undefined,
			},
			{
				verdi: '7008',
				visningsnavn: 'Satt på vent pga for tidlig søknad',
				gruppering: undefined,
			},
			{
				verdi: '7009',
				visningsnavn: 'Vent på oppdatering som passerer kompletthetssjekk',
				gruppering: undefined,
			},
			{
				verdi: '7014',
				visningsnavn: 'Vent på rapporteringsfrist for inntekt',
				gruppering: undefined,
			},
			{
				verdi: '7019',
				visningsnavn: 'Autopunkt gradering uten beregningsgrunnlag',
				gruppering: undefined,
			},
			{
				verdi: '7020',
				visningsnavn: 'Vent på siste meldekort for AAP eller DP-mottaker',
				gruppering: undefined,
			},
			{
				verdi: '7022',
				visningsnavn: 'Vent på ny inntektsmelding med gyldig arbeidsforholdId',
				gruppering: undefined,
			},
			{
				verdi: '7023',
				visningsnavn: 'Autopunkt militær i opptjeningsperioden og beregninggrunnlag under 3G',
				gruppering: undefined,
			},
			{
				verdi: '7025',
				visningsnavn: 'Autopunkt gradering flere arbeidsforhold',
				gruppering: undefined,
			},
			{
				verdi: '7030',
				visningsnavn: 'Vent på etterlyst inntektsmelding',
				gruppering: undefined,
			},
			{
				verdi: '7035',
				visningsnavn: 'Venter på manglende funksjonalitet, bruker 70år ved refusjonskrav',
				gruppering: undefined,
			},
			{
				verdi: '9068',
				visningsnavn: 'Vent på etterlyst inntektsmelding',
				gruppering: undefined,
			},
			{
				verdi: '9070',
				visningsnavn: 'Vent på etterlyst inntektsmelding og/eller tilsvar på varsel om avslag',
				gruppering: undefined,
			},
			{
				verdi: '7041',
				visningsnavn:
					'Vent på vedtak om lovendring vedrørende beregning av næring i kombinasjon med arbeid eller frilans',
				gruppering: undefined,
			},
			{
				verdi: '8000',
				visningsnavn: 'Venter på manglende funksjonalitet.',
				gruppering: undefined,
			},
			{
				verdi: '8003',
				visningsnavn: 'Venter på manglende funksjonalitet.',
				gruppering: undefined,
			},
			{
				verdi: '8005',
				visningsnavn: 'Arbeidstaker og frilanser i samme organisasjon, kan ikke beregnes.',
				gruppering: undefined,
			},
			{
				verdi: '8004',
				visningsnavn: 'Saksbehandler overstyrer oppgitt opptjening',
				gruppering: undefined,
			},
			{
				verdi: '9001',
				visningsnavn: 'Kontroller legeerklæring',
				gruppering: undefined,
			},
			{
				verdi: '9002',
				visningsnavn: 'Omsorgen for',
				gruppering: undefined,
			},
			{
				verdi: '9020',
				visningsnavn: 'Omsorgen for',
				gruppering: undefined,
			},
			{
				verdi: '9099',
				visningsnavn: 'Omsorgen for',
				gruppering: undefined,
			},
			{
				verdi: '9003',
				visningsnavn: 'Årskvantum',
				gruppering: undefined,
			},
			{
				verdi: '9004',
				visningsnavn: 'Årskvantum dokumentasjon',
				gruppering: undefined,
			},
			{
				verdi: '9013',
				visningsnavn: 'Utvidet Rett',
				gruppering: undefined,
			},
			{
				verdi: '9014',
				visningsnavn: 'Årskvantum',
				gruppering: undefined,
			},
			{
				verdi: '9015',
				visningsnavn: 'Vurder aldersvilkår barn',
				gruppering: undefined,
			},
			{
				verdi: '9005',
				visningsnavn: 'Overstyr input beregning',
				gruppering: undefined,
			},
			{
				verdi: '9006',
				visningsnavn: 'Venter på punsjet søknad',
				gruppering: undefined,
			},
			{
				verdi: '9007',
				visningsnavn: 'Mangler søknad for periode i inneværende år',
				gruppering: undefined,
			},
			{
				verdi: '9008',
				visningsnavn: 'Mangler søknad for annen parts periode',
				gruppering: undefined,
			},
			{
				verdi: '9200',
				visningsnavn: 'Vurder nattevåk og beredskap',
				gruppering: undefined,
			},
			{
				verdi: '9201',
				visningsnavn: 'Vurder nattevåk og beredskap',
				gruppering: undefined,
			},
			{
				verdi: '9202',
				visningsnavn: 'Vurder rett etter pleietrengendes død',
				gruppering: undefined,
			},
			{
				verdi: '9203',
				visningsnavn: 'Bruker har ikke oppgitt alle arbeidsgiverne sine',
				gruppering: undefined,
			},
			{
				verdi: '9290',
				visningsnavn:
					'En annen sak tilknyttet barnet må behandles frem til uttak, eller besluttes, før denne saken kan behandles videre.',
				gruppering: undefined,
			},
			{
				verdi: '9291',
				visningsnavn: 'Vurder hvilken dato ny regel for utbetalingsgrad i uttak skal gjelde fra.',
				gruppering: undefined,
			},
			{
				verdi: '9300',
				visningsnavn: 'Vurder om institusjonen er godkjent',
				gruppering: undefined,
			},
			{
				verdi: '9301',
				visningsnavn: 'Vurder om opplæringen er nødvendig for å behandle og ta seg av barnet',
				gruppering: undefined,
			},
			{
				verdi: '9302',
				visningsnavn: 'Vurder om opplæringen er gjennomgått',
				gruppering: undefined,
			},
			{
				verdi: '9303',
				visningsnavn: 'Vurder reisetid',
				gruppering: undefined,
			},
			{
				verdi: '9999',
				visningsnavn: 'Venter på manglende funksjonalitet.',
				gruppering: undefined,
			},
		],
	},
	{
		område: 'K9',
		kode: OppgavefilterKode.MottattDato,
		visningsnavn: 'Mottatt dato',
		tolkes_som: TolkesSom.Timestamp,
		kokriterie: false,
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: OppgavefilterKode.NyeKrav,
		visningsnavn: 'Nye krav',
		tolkes_som: TolkesSom.Boolean,
		kokriterie: false,
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: null,
		kode: OppgavefilterKode.Oppgavestatus,
		visningsnavn: 'Oppgavestatus',
		tolkes_som: TolkesSom.String,
		kokriterie: false,
		verdiforklaringerErUttømmende: true,
		verdiforklaringer: [
			{
				verdi: 'AAPEN',
				visningsnavn: 'Åpen',
				gruppering: undefined,
			},
			{
				verdi: 'VENTER',
				visningsnavn: 'Venter',
				gruppering: undefined,
			},
			{
				verdi: 'LUKKET',
				visningsnavn: 'Lukket',
				gruppering: undefined,
			},
		],
	},
	{
		område: null,
		kode: OppgavefilterKode.Oppgavetype,
		visningsnavn: 'Oppgavetype',
		tolkes_som: TolkesSom.String,
		kokriterie: false,
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: [],
	},
	{
		område: 'K9',
		kode: OppgavefilterKode.PleietrengendeAktorId,
		visningsnavn: 'Pleietrengende aktor id',
		tolkes_som: TolkesSom.String,
		kokriterie: false,
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: OppgavefilterKode.PåklagdBehandlingUuid,
		visningsnavn: 'Påklagd behandling uuid',
		tolkes_som: TolkesSom.String,
		kokriterie: false,
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: OppgavefilterKode.RegistrertDato,
		visningsnavn: 'Registrert dato',
		tolkes_som: TolkesSom.Timestamp,
		kokriterie: false,
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: OppgavefilterKode.RelatertPartAktorid,
		visningsnavn: 'Relatert part aktorid',
		tolkes_som: TolkesSom.String,
		kokriterie: false,
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: OppgavefilterKode.Resultattype,
		visningsnavn: 'Resultattype',
		tolkes_som: TolkesSom.String,
		kokriterie: false,
		verdiforklaringerErUttømmende: true,
		verdiforklaringer: [
			{
				verdi: 'IKKE_FASTSATT',
				visningsnavn: 'Ikke fastsatt',
				gruppering: undefined,
			},
			{
				verdi: 'INNVILGET',
				visningsnavn: 'Innvilget',
				gruppering: undefined,
			},
			{
				verdi: 'DELVIS_INNVILGET',
				visningsnavn: 'Delvis innvilget',
				gruppering: undefined,
			},
			{
				verdi: 'AVSLÅTT',
				visningsnavn: 'Avslått',
				gruppering: undefined,
			},
			{
				verdi: 'OPPHØR',
				visningsnavn: 'Opphør',
				gruppering: undefined,
			},
			{
				verdi: 'HENLAGT_SØKNAD_TRUKKET',
				visningsnavn: 'Henlagt, søknaden er trukket',
				gruppering: undefined,
			},
			{
				verdi: 'HENLAGT_FEILOPPRETTET',
				visningsnavn: 'Henlagt, søknaden er feilopprettet',
				gruppering: undefined,
			},
			{
				verdi: 'HENLAGT_BRUKER_DØD',
				visningsnavn: 'Henlagt, brukeren er død',
				gruppering: undefined,
			},
			{
				verdi: 'MERGET_OG_HENLAGT',
				visningsnavn: 'Mottatt ny søknad',
				gruppering: undefined,
			},
			{
				verdi: 'HENLAGT_SØKNAD_MANGLER',
				visningsnavn: 'Henlagt søknad mangler',
				gruppering: undefined,
			},
			{
				verdi: 'HENLAGT_MASKINELT',
				visningsnavn: 'Henlagt maskinelt',
				gruppering: undefined,
			},
			{
				verdi: 'INNVILGET_ENDRING',
				visningsnavn: 'Endring innvilget',
				gruppering: undefined,
			},
			{
				verdi: 'INGEN_ENDRING',
				visningsnavn: 'Ingen endring',
				gruppering: undefined,
			},
			{
				verdi: 'MANGLER_BEREGNINGSREGLER',
				visningsnavn: 'Mangler beregningsregler',
				gruppering: undefined,
			},
		],
	},
	{
		område: 'K9',
		kode: OppgavefilterKode.Saksnummer,
		visningsnavn: 'Saksnummer',
		tolkes_som: TolkesSom.String,
		kokriterie: false,
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: OppgavefilterKode.Totrinnskontroll,
		visningsnavn: 'Totrinnskontroll',
		tolkes_som: TolkesSom.Boolean,
		kokriterie: false,
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: OppgavefilterKode.Vedtaksdato,
		visningsnavn: 'Vedtaksdato',
		tolkes_som: TolkesSom.Timestamp,
		kokriterie: false,
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: OppgavefilterKode.Ytelsestype,
		visningsnavn: 'Ytelsestype',
		tolkes_som: TolkesSom.String,
		kokriterie: false,
		verdiforklaringerErUttømmende: true,
		verdiforklaringer: [
			{
				verdi: 'PSB',
				visningsnavn: 'Pleiepenger sykt barn',
				gruppering: undefined,
			},
			{
				verdi: 'OMP',
				visningsnavn: 'Omsorgspenger',
				gruppering: undefined,
			},
			{
				verdi: 'OMD',
				visningsnavn: 'Omsorgsdager: overføring',
				gruppering: undefined,
			},
			{
				verdi: 'FRISINN',
				visningsnavn: 'Frisinn',
				gruppering: undefined,
			},
			{
				verdi: 'PPN',
				visningsnavn: 'Pleiepenger i livets sluttfase',
				gruppering: undefined,
			},
			{
				verdi: 'OLP',
				visningsnavn: 'Opplæringspenger',
				gruppering: undefined,
			},
			{
				verdi: 'OMP_KS',
				visningsnavn: 'Omsorgsdager: kronisk syk',
				gruppering: undefined,
			},
			{
				verdi: 'OMP_MA',
				visningsnavn: 'Omsorgsdager: midlertidig alene',
				gruppering: undefined,
			},
			{
				verdi: 'OMP_AO',
				visningsnavn: 'Omsorgsdager: alene om omsorg',
				gruppering: undefined,
			},
			{
				verdi: 'UKJENT',
				visningsnavn: 'Ukjent',
				gruppering: undefined,
			},
		],
	},
];
