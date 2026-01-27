export const oppgaveQueryForDuration = {
	filtere: [
		{
			id: '9c826b1e-35f3-416f-a4b2-7c0862e90c9b',
			type: 'feltverdi',
			område: 'K9',
			kode: 'akkumulertVentetidSaksbehandlerForTidligereVersjoner',
			operator: 'GREATER_THAN',
			verdi: 'P100DT',
		},
	],
	select: [
		{
			id: '77530d5d-0ec6-4a1e-aa5d-ea27a5a30655',
			type: 'enkel',
			område: 'K9',
			kode: 'akkumulertVentetidSaksbehandlerForTidligereVersjoner',
		},
	],
	order: [],
	limit: 10,
	id: 'ba50126a-5e5e-4c24-86ea-0255af308837',
};

export const oppgaverMedDuration = [
	{
		felter: [
			{
				område: 'K9',
				kode: 'akkumulertVentetidSaksbehandlerForTidligereVersjoner',
				verdi: 'PT2729H38M17.206648844S',
			},
		],
	},
	{
		felter: [
			{
				område: 'K9',
				kode: 'akkumulertVentetidSaksbehandlerForTidligereVersjoner',
				verdi: 'PT6726H14M36.343829446S',
			},
		],
	},
	{
		felter: [
			{
				område: 'K9',
				kode: 'akkumulertVentetidSaksbehandlerForTidligereVersjoner',
				verdi: 'PT3073H46M51.467301321S',
			},
		],
	},
	{
		felter: [
			{
				område: 'K9',
				kode: 'akkumulertVentetidSaksbehandlerForTidligereVersjoner',
				verdi: 'PT7033H2M49.007959404S',
			},
		],
	},
	{
		felter: [
			{
				område: 'K9',
				kode: 'akkumulertVentetidSaksbehandlerForTidligereVersjoner',
				verdi: 'PT3718H26M1.401001181S',
			},
		],
	},
	{
		felter: [
			{
				område: 'K9',
				kode: 'akkumulertVentetidSaksbehandlerForTidligereVersjoner',
				verdi: 'PT2811H7M30.840869325S',
			},
		],
	},
	{
		felter: [
			{
				område: 'K9',
				kode: 'akkumulertVentetidSaksbehandlerForTidligereVersjoner',
				verdi: 'PT6647H44M16.82464825S',
			},
		],
	},
	{
		felter: [
			{
				område: 'K9',
				kode: 'akkumulertVentetidSaksbehandlerForTidligereVersjoner',
				verdi: 'PT4010H47M50.980515912S',
			},
		],
	},
	{
		felter: [
			{
				område: 'K9',
				kode: 'akkumulertVentetidSaksbehandlerForTidligereVersjoner',
				verdi: 'PT10198H6M33.2663571S',
			},
		],
	},
	{
		felter: [
			{
				område: 'K9',
				kode: 'akkumulertVentetidSaksbehandlerForTidligereVersjoner',
				verdi: 'PT4204H18M24.56699856S',
			},
		],
	},
];
export const oppgaveQueryForDate = {
	filtere: [
		{
			id: 'eb02fb7d-af6f-4844-a8e7-b68d4d4ac57a',
			type: 'feltverdi',
			område: 'K9',
			kode: 'mottattDato',
			operator: 'NOT_EQUALS',
			verdi: '2023-02-16T23:00:00.000Z',
		},
	],
	select: [
		{
			id: '6a87800f-1d70-4e7e-a414-81a6607fd173',
			type: 'enkel',
			område: 'K9',
			kode: 'mottattDato',
		},
	],
	order: [],
	limit: 10,
	id: '4d552437-e47e-44a9-9239-99c8f2ea4963',
};
export const oppgaverMedDate = [
	{
		felter: [
			{
				område: 'K9',
				kode: 'mottattDato',
				verdi: '2022-12-21T07:34:47.687703619',
			},
		],
	},
	{
		felter: [
			{
				område: 'K9',
				kode: 'mottattDato',
				verdi: '2021-09-14T16:56:45.581289217',
			},
		],
	},
	{
		felter: [
			{
				område: 'K9',
				kode: 'mottattDato',
				verdi: '2021-12-20T16:03:45.165071571',
			},
		],
	},
	{
		felter: [
			{
				område: 'K9',
				kode: 'mottattDato',
				verdi: '2020-08-26T15:21:39.967493',
			},
		],
	},
	{
		felter: [
			{
				område: 'K9',
				kode: 'mottattDato',
				verdi: '2022-12-25T12:36:34.953825956',
			},
		],
	},
	{
		felter: [
			{
				område: 'K9',
				kode: 'mottattDato',
				verdi: '2021-06-21T13:05:58.255014246',
			},
		],
	},
	{
		felter: [
			{
				område: 'K9',
				kode: 'mottattDato',
				verdi: '2022-12-24T14:30:00.958232203',
			},
		],
	},
	{
		felter: [
			{
				område: 'K9',
				kode: 'mottattDato',
				verdi: '2021-01-20T14:08:50.047604',
			},
		],
	},
	{
		felter: [
			{
				område: 'K9',
				kode: 'mottattDato',
				verdi: '2023-03-10T18:19:58.043496508',
			},
		],
	},
	{
		felter: [
			{
				område: 'K9',
				kode: 'mottattDato',
				verdi: '2021-02-24T12:12:08.434053',
			},
		],
	},
];

export const felter = [
	{
		område: 'K9',
		kode: 'akkumulertVentetidAnnetForTidligereVersjoner',
		visningsnavn: 'Akkumulert ventetid annet for tidligere versjoner',
		tolkes_som: 'Duration',
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: 'akkumulertVentetidAnnetIkkeSaksbehandlingstidForTidligereVersjoner',
		visningsnavn: 'Akkumulert ventetid annet ikke saksbehandlingstid for tidligere versjoner',
		tolkes_som: 'Duration',
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: 'akkumulertVentetidArbeidsgiverForTidligereVersjoner',
		visningsnavn: 'Akkumulert ventetid arbeidsgiver for tidligere versjoner',
		tolkes_som: 'Duration',
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: 'akkumulertVentetidSaksbehandlerForTidligereVersjoner',
		visningsnavn: 'Akkumulert ventetid saksbehandler for tidligere versjoner',
		tolkes_som: 'Duration',
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: 'akkumulertVentetidSøkerForTidligereVersjoner',
		visningsnavn: 'Akkumulert ventetid søker for tidligere versjoner',
		tolkes_som: 'Duration',
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: 'akkumulertVentetidTekniskFeilForTidligereVersjoner',
		visningsnavn: 'Akkumulert ventetid teknisk feil for tidligere versjoner',
		tolkes_som: 'Duration',
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: 'aksjonspunkt',
		visningsnavn: 'Aksjonspunkt',
		tolkes_som: 'String',
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: [
			{
				verdi: '5009',
				visningsnavn: 'Avklar tilleggsopplysninger',
			},
			{
				verdi: '5015',
				visningsnavn: 'Foreslå vedtak',
			},
			{
				verdi: '5016',
				visningsnavn: 'Fatter vedtak',
			},
			{
				verdi: '5017',
				visningsnavn: 'Vurder søkers opplysningsplikt ved ufullstendig/ikke-komplett søknad',
			},
			{
				verdi: '5018',
				visningsnavn: 'Foreslå vedtak uten totrinnskontroll',
			},
			{
				verdi: '5019',
				visningsnavn: 'Avklar lovlig opphold.',
			},
			{
				verdi: '5020',
				visningsnavn: 'Avklar om bruker er bosatt.',
			},
			{
				verdi: '5021',
				visningsnavn: 'Avklar om bruker har gyldig periode.',
			},
			{
				verdi: '5023',
				visningsnavn: 'Avklar oppholdsrett.',
			},
			{
				verdi: '5026',
				visningsnavn: 'Varsel om revurdering opprettet manuelt',
			},
			{
				verdi: '5028',
				visningsnavn: 'Foreslå vedtak manuelt',
			},
			{
				verdi: '5030',
				visningsnavn: 'Avklar verge',
			},
			{
				verdi: '5033',
				visningsnavn: 'Vurdere annen ytelse før vedtak',
			},
			{
				verdi: '5034',
				visningsnavn: 'Vurdere dokument før vedtak',
			},
			{
				verdi: '5040',
				visningsnavn: 'Vurdere overlappende ytelse før vedtak',
			},
			{
				verdi: '5038',
				visningsnavn: 'Fastsette beregningsgrunnlag for arbeidstaker/frilanser skjønnsmessig',
			},
			{
				verdi: '5039',
				visningsnavn: 'Vurder varig endret/nyoppstartet næring selvstendig næringsdrivende',
			},
			{
				verdi: '5054',
				visningsnavn: 'Vurder varig endret/nyoppstartet næring selvstendig næringsdrivende',
			},
			{
				verdi: '5042',
				visningsnavn: 'Fastsett beregningsgrunnlag for selvstendig næringsdrivende',
			},
			{
				verdi: '5046',
				visningsnavn: 'Fordel beregningsgrunnlag',
			},
			{
				verdi: '5067',
				visningsnavn: 'Fordel beregningsgrunnlag',
			},
			{
				verdi: '5059',
				visningsnavn: 'Vurder refusjon beregningsgrunnlag',
			},
			{
				verdi: '5047',
				visningsnavn: 'Fastsett beregningsgrunnlag for tidsbegrenset arbeidsforhold',
			},
			{
				verdi: '5049',
				visningsnavn: 'Fastsett beregningsgrunnlag for SN som er ny i arbeidslivet',
			},
			{
				verdi: '5050',
				visningsnavn: 'Vurder gradering på andel uten beregningsgrunnlag',
			},
			{
				verdi: '5051',
				visningsnavn: 'Vurder perioder med opptjening',
			},
			{
				verdi: '5052',
				visningsnavn: 'Avklar aktivitet for beregning',
			},
			{
				verdi: '5053',
				visningsnavn: 'Avklar medlemskap.',
			},
			{
				verdi: '5055',
				visningsnavn: 'Vurder varsel ved vedtak til ugunst',
			},
			{
				verdi: '5056',
				visningsnavn: 'Kontroll av manuelt opprettet revurderingsbehandling',
			},
			{
				verdi: '5057',
				visningsnavn: 'Manuell tilkjenning av ytelse',
			},
			{
				verdi: '5058',
				visningsnavn: 'Vurder fakta for arbeidstaker, frilans og selvstendig næringsdrivende',
			},
			{
				verdi: '5068',
				visningsnavn: 'Innhent dokumentasjon fra utenlandsk trygdemyndighet',
			},
			{
				verdi: '5072',
				visningsnavn: 'Søker er stortingsrepresentant/administrativt ansatt i Stortinget',
			},
			{
				verdi: '5080',
				visningsnavn: 'Avklar arbeidsforhold',
			},
			{
				verdi: '5084',
				visningsnavn: 'Vurder feilutbetaling',
			},
			{
				verdi: '5085',
				visningsnavn: 'Sjekk om ytelsesbehandlingen skal utføres før eller etter tilbakekrevingsbehandlingen',
			},
			{
				verdi: '5089',
				visningsnavn: 'Manuell vurdering av opptjeningsvilkår',
			},
			{
				verdi: '5090',
				visningsnavn: 'Vurder tilbaketrekk',
			},
			{
				verdi: '5077',
				visningsnavn: 'Vurder søknadsfrist',
			},
			{
				verdi: '9069',
				visningsnavn: 'Avklar om inntektsmeldinger kreves for å kunne beregne',
			},
			{
				verdi: '9071',
				visningsnavn:
					'Endeling avklaring om inntektsmeldinger kreves for å kunne beregne eller om perioden skal avslås',
			},
			{
				verdi: '6002',
				visningsnavn: 'Saksbehandler initierer kontroll av søkers opplysningsplikt',
			},
			{
				verdi: '6005',
				visningsnavn: 'Overstyring av medlemskapsvilkåret',
			},
			{
				verdi: '6006',
				visningsnavn: 'Overstyring av Søknadsfrist',
			},
			{
				verdi: '6004',
				visningsnavn: 'Overstyring av medisinskvilkår for pleietrengende under 18 år',
			},
			{
				verdi: '6008',
				visningsnavn: 'Overstyring av medisinskvilkår for pleietrengende 18 år',
			},
			{
				verdi: '6003',
				visningsnavn: 'Overstyring av Omsorgen for',
			},
			{
				verdi: '6007',
				visningsnavn: 'Overstyring av beregning',
			},
			{
				verdi: '6011',
				visningsnavn: 'Overstyring av opptjeningsvilkåret',
			},
			{
				verdi: '6014',
				visningsnavn: 'Overstyring av beregningsaktiviteter',
			},
			{
				verdi: '6015',
				visningsnavn: 'Overstyring av beregningsgrunnlag',
			},
			{
				verdi: '6016',
				visningsnavn: 'Overstyring av K9-vilkåret',
			},
			{
				verdi: '6068',
				visningsnavn: 'Manuell markering av utenlandssak',
			},
			{
				verdi: '7001',
				visningsnavn: 'Manuelt satt på vent',
			},
			{
				verdi: '7003',
				visningsnavn: 'Venter på komplett søknad',
			},
			{
				verdi: '7005',
				visningsnavn: 'Satt på vent etter varsel om revurdering',
			},
			{
				verdi: '7006',
				visningsnavn: 'Venter på opptjeningsopplysninger',
			},
			{
				verdi: '7008',
				visningsnavn: 'Satt på vent pga for tidlig søknad',
			},
			{
				verdi: '7009',
				visningsnavn: 'Vent på oppdatering som passerer kompletthetssjekk',
			},
			{
				verdi: '7014',
				visningsnavn: 'Vent på rapporteringsfrist for inntekt',
			},
			{
				verdi: '7019',
				visningsnavn: 'Autopunkt gradering uten beregningsgrunnlag',
			},
			{
				verdi: '7020',
				visningsnavn: 'Vent på siste meldekort for AAP eller DP-mottaker',
			},
			{
				verdi: '7022',
				visningsnavn: 'Vent på ny inntektsmelding med gyldig arbeidsforholdId',
			},
			{
				verdi: '7023',
				visningsnavn: 'Autopunkt militær i opptjeningsperioden og beregninggrunnlag under 3G',
			},
			{
				verdi: '7025',
				visningsnavn: 'Autopunkt gradering flere arbeidsforhold',
			},
			{
				verdi: '7030',
				visningsnavn: 'Vent på etterlyst inntektsmelding',
			},
			{
				verdi: '7035',
				visningsnavn: 'Venter på manglende funksjonalitet, bruker 70år ved refusjonskrav',
			},
			{
				verdi: '9068',
				visningsnavn: 'Vent på etterlyst inntektsmelding',
			},
			{
				verdi: '9070',
				visningsnavn: 'Vent på etterlyst inntektsmelding og/eller tilsvar på varsel om avslag',
			},
			{
				verdi: '7041',
				visningsnavn:
					'Vent på vedtak om lovendring vedrørende beregning av næring i kombinasjon med arbeid eller frilans',
			},
			{
				verdi: '8000',
				visningsnavn: 'Venter på manglende funksjonalitet.',
			},
			{
				verdi: '8003',
				visningsnavn: 'Venter på manglende funksjonalitet.',
			},
			{
				verdi: '8005',
				visningsnavn: 'Arbeidstaker og frilanser i samme organisasjon, kan ikke beregnes.',
			},
			{
				verdi: '8004',
				visningsnavn: 'Saksbehandler overstyrer oppgitt opptjening',
			},
			{
				verdi: '9001',
				visningsnavn: 'Kontroller legeerklæring',
			},
			{
				verdi: '9002',
				visningsnavn: 'Omsorgen for',
			},
			{
				verdi: '9020',
				visningsnavn: 'Omsorgen for',
			},
			{
				verdi: '9099',
				visningsnavn: 'Omsorgen for',
			},
			{
				verdi: '9003',
				visningsnavn: 'Årskvantum',
			},
			{
				verdi: '9004',
				visningsnavn: 'Årskvantum dokumentasjon',
			},
			{
				verdi: '9013',
				visningsnavn: 'Utvidet Rett',
			},
			{
				verdi: '9014',
				visningsnavn: 'Årskvantum',
			},
			{
				verdi: '9015',
				visningsnavn: 'Vurder aldersvilkår barn',
			},
			{
				verdi: '9005',
				visningsnavn: 'Overstyr input beregning',
			},
			{
				verdi: '9006',
				visningsnavn: 'Venter på punsjet søknad',
			},
			{
				verdi: '9007',
				visningsnavn: 'Mangler søknad for periode i inneværende år',
			},
			{
				verdi: '9008',
				visningsnavn: 'Mangler søknad for annen parts periode',
			},
			{
				verdi: '9200',
				visningsnavn: 'Vurder nattevåk og beredskap',
			},
			{
				verdi: '9201',
				visningsnavn: 'Vurder nattevåk og beredskap',
			},
			{
				verdi: '9202',
				visningsnavn: 'Vurder rett etter pleietrengendes død',
			},
			{
				verdi: '9203',
				visningsnavn: 'Bruker har ikke oppgitt alle arbeidsgiverne sine',
			},
			{
				verdi: '9290',
				visningsnavn:
					'En annen sak tilknyttet barnet må behandles frem til uttak, eller besluttes, før denne saken kan behandles videre.',
			},
			{
				verdi: '9300',
				visningsnavn: 'Vurder om institusjonen er godkjent',
			},
			{
				verdi: '9301',
				visningsnavn: 'Vurder om opplæringen er nødvendig for å behandle og ta seg av barnet',
			},
			{
				verdi: '9302',
				visningsnavn: 'Vurder om opplæringen er gjennomgått',
			},
			{
				verdi: '9303',
				visningsnavn: 'Vurder reisetid',
			},
			{
				verdi: '9999',
				visningsnavn: 'Venter på manglende funksjonalitet.',
			},
		],
	},
	{
		område: 'K9',
		kode: 'aktivVentefrist',
		visningsnavn: 'Aktiv ventefrist',
		tolkes_som: 'Timestamp',
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: 'aktivVenteårsak',
		visningsnavn: 'Aktiv venteårsak',
		tolkes_som: 'String',
		verdiforklaringerErUttømmende: true,
		verdiforklaringer: [
			{
				verdi: 'AVV_DOK',
				visningsnavn: 'Avventer dokumentasjon',
			},
			{
				verdi: 'VENT_MANGL_FUNKSJ_SAKSBEHANDLER',
				visningsnavn: 'Manglende funksjonalitet i løsningen',
			},
			{
				verdi: 'VENTER_SVAR_INTERNT',
				visningsnavn: 'Meldt i Porten eller Teams',
			},
			{
				verdi: 'AUTOMATISK',
				visningsnavn: 'Automatisk satt på vent',
			},
			{
				verdi: 'UKJENT',
				visningsnavn: 'Mangler venteårsak',
			},
		],
	},
	{
		område: 'K9',
		kode: 'aktivtAksjonspunkt',
		visningsnavn: 'Aktivt aksjonspunkt',
		tolkes_som: 'String',
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: [
			{
				verdi: '5009',
				visningsnavn: 'Avklar tilleggsopplysninger',
			},
			{
				verdi: '5015',
				visningsnavn: 'Foreslå vedtak',
			},
			{
				verdi: '5016',
				visningsnavn: 'Fatter vedtak',
			},
			{
				verdi: '5017',
				visningsnavn: 'Vurder søkers opplysningsplikt ved ufullstendig/ikke-komplett søknad',
			},
			{
				verdi: '5018',
				visningsnavn: 'Foreslå vedtak uten totrinnskontroll',
			},
			{
				verdi: '5019',
				visningsnavn: 'Avklar lovlig opphold.',
			},
			{
				verdi: '5020',
				visningsnavn: 'Avklar om bruker er bosatt.',
			},
			{
				verdi: '5021',
				visningsnavn: 'Avklar om bruker har gyldig periode.',
			},
			{
				verdi: '5023',
				visningsnavn: 'Avklar oppholdsrett.',
			},
			{
				verdi: '5026',
				visningsnavn: 'Varsel om revurdering opprettet manuelt',
			},
			{
				verdi: '5028',
				visningsnavn: 'Foreslå vedtak manuelt',
			},
			{
				verdi: '5030',
				visningsnavn: 'Avklar verge',
			},
			{
				verdi: '5033',
				visningsnavn: 'Vurdere annen ytelse før vedtak',
			},
			{
				verdi: '5034',
				visningsnavn: 'Vurdere dokument før vedtak',
			},
			{
				verdi: '5040',
				visningsnavn: 'Vurdere overlappende ytelse før vedtak',
			},
			{
				verdi: '5038',
				visningsnavn: 'Fastsette beregningsgrunnlag for arbeidstaker/frilanser skjønnsmessig',
			},
			{
				verdi: '5039',
				visningsnavn: 'Vurder varig endret/nyoppstartet næring selvstendig næringsdrivende',
			},
			{
				verdi: '5054',
				visningsnavn: 'Vurder varig endret/nyoppstartet næring selvstendig næringsdrivende',
			},
			{
				verdi: '5042',
				visningsnavn: 'Fastsett beregningsgrunnlag for selvstendig næringsdrivende',
			},
			{
				verdi: '5046',
				visningsnavn: 'Fordel beregningsgrunnlag',
			},
			{
				verdi: '5067',
				visningsnavn: 'Fordel beregningsgrunnlag',
			},
			{
				verdi: '5059',
				visningsnavn: 'Vurder refusjon beregningsgrunnlag',
			},
			{
				verdi: '5047',
				visningsnavn: 'Fastsett beregningsgrunnlag for tidsbegrenset arbeidsforhold',
			},
			{
				verdi: '5049',
				visningsnavn: 'Fastsett beregningsgrunnlag for SN som er ny i arbeidslivet',
			},
			{
				verdi: '5050',
				visningsnavn: 'Vurder gradering på andel uten beregningsgrunnlag',
			},
			{
				verdi: '5051',
				visningsnavn: 'Vurder perioder med opptjening',
			},
			{
				verdi: '5052',
				visningsnavn: 'Avklar aktivitet for beregning',
			},
			{
				verdi: '5053',
				visningsnavn: 'Avklar medlemskap.',
			},
			{
				verdi: '5055',
				visningsnavn: 'Vurder varsel ved vedtak til ugunst',
			},
			{
				verdi: '5056',
				visningsnavn: 'Kontroll av manuelt opprettet revurderingsbehandling',
			},
			{
				verdi: '5057',
				visningsnavn: 'Manuell tilkjenning av ytelse',
			},
			{
				verdi: '5058',
				visningsnavn: 'Vurder fakta for arbeidstaker, frilans og selvstendig næringsdrivende',
			},
			{
				verdi: '5068',
				visningsnavn: 'Innhent dokumentasjon fra utenlandsk trygdemyndighet',
			},
			{
				verdi: '5072',
				visningsnavn: 'Søker er stortingsrepresentant/administrativt ansatt i Stortinget',
			},
			{
				verdi: '5080',
				visningsnavn: 'Avklar arbeidsforhold',
			},
			{
				verdi: '5084',
				visningsnavn: 'Vurder feilutbetaling',
			},
			{
				verdi: '5085',
				visningsnavn: 'Sjekk om ytelsesbehandlingen skal utføres før eller etter tilbakekrevingsbehandlingen',
			},
			{
				verdi: '5089',
				visningsnavn: 'Manuell vurdering av opptjeningsvilkår',
			},
			{
				verdi: '5090',
				visningsnavn: 'Vurder tilbaketrekk',
			},
			{
				verdi: '5077',
				visningsnavn: 'Vurder søknadsfrist',
			},
			{
				verdi: '9069',
				visningsnavn: 'Avklar om inntektsmeldinger kreves for å kunne beregne',
			},
			{
				verdi: '9071',
				visningsnavn:
					'Endeling avklaring om inntektsmeldinger kreves for å kunne beregne eller om perioden skal avslås',
			},
			{
				verdi: '6002',
				visningsnavn: 'Saksbehandler initierer kontroll av søkers opplysningsplikt',
			},
			{
				verdi: '6005',
				visningsnavn: 'Overstyring av medlemskapsvilkåret',
			},
			{
				verdi: '6006',
				visningsnavn: 'Overstyring av Søknadsfrist',
			},
			{
				verdi: '6004',
				visningsnavn: 'Overstyring av medisinskvilkår for pleietrengende under 18 år',
			},
			{
				verdi: '6008',
				visningsnavn: 'Overstyring av medisinskvilkår for pleietrengende 18 år',
			},
			{
				verdi: '6003',
				visningsnavn: 'Overstyring av Omsorgen for',
			},
			{
				verdi: '6007',
				visningsnavn: 'Overstyring av beregning',
			},
			{
				verdi: '6011',
				visningsnavn: 'Overstyring av opptjeningsvilkåret',
			},
			{
				verdi: '6014',
				visningsnavn: 'Overstyring av beregningsaktiviteter',
			},
			{
				verdi: '6015',
				visningsnavn: 'Overstyring av beregningsgrunnlag',
			},
			{
				verdi: '6016',
				visningsnavn: 'Overstyring av K9-vilkåret',
			},
			{
				verdi: '6068',
				visningsnavn: 'Manuell markering av utenlandssak',
			},
			{
				verdi: '7001',
				visningsnavn: 'Manuelt satt på vent',
			},
			{
				verdi: '7003',
				visningsnavn: 'Venter på komplett søknad',
			},
			{
				verdi: '7005',
				visningsnavn: 'Satt på vent etter varsel om revurdering',
			},
			{
				verdi: '7006',
				visningsnavn: 'Venter på opptjeningsopplysninger',
			},
			{
				verdi: '7008',
				visningsnavn: 'Satt på vent pga for tidlig søknad',
			},
			{
				verdi: '7009',
				visningsnavn: 'Vent på oppdatering som passerer kompletthetssjekk',
			},
			{
				verdi: '7014',
				visningsnavn: 'Vent på rapporteringsfrist for inntekt',
			},
			{
				verdi: '7019',
				visningsnavn: 'Autopunkt gradering uten beregningsgrunnlag',
			},
			{
				verdi: '7020',
				visningsnavn: 'Vent på siste meldekort for AAP eller DP-mottaker',
			},
			{
				verdi: '7022',
				visningsnavn: 'Vent på ny inntektsmelding med gyldig arbeidsforholdId',
			},
			{
				verdi: '7023',
				visningsnavn: 'Autopunkt militær i opptjeningsperioden og beregninggrunnlag under 3G',
			},
			{
				verdi: '7025',
				visningsnavn: 'Autopunkt gradering flere arbeidsforhold',
			},
			{
				verdi: '7030',
				visningsnavn: 'Vent på etterlyst inntektsmelding',
			},
			{
				verdi: '7035',
				visningsnavn: 'Venter på manglende funksjonalitet, bruker 70år ved refusjonskrav',
			},
			{
				verdi: '9068',
				visningsnavn: 'Vent på etterlyst inntektsmelding',
			},
			{
				verdi: '9070',
				visningsnavn: 'Vent på etterlyst inntektsmelding og/eller tilsvar på varsel om avslag',
			},
			{
				verdi: '7041',
				visningsnavn:
					'Vent på vedtak om lovendring vedrørende beregning av næring i kombinasjon med arbeid eller frilans',
			},
			{
				verdi: '8000',
				visningsnavn: 'Venter på manglende funksjonalitet.',
			},
			{
				verdi: '8003',
				visningsnavn: 'Venter på manglende funksjonalitet.',
			},
			{
				verdi: '8005',
				visningsnavn: 'Arbeidstaker og frilanser i samme organisasjon, kan ikke beregnes.',
			},
			{
				verdi: '8004',
				visningsnavn: 'Saksbehandler overstyrer oppgitt opptjening',
			},
			{
				verdi: '9001',
				visningsnavn: 'Kontroller legeerklæring',
			},
			{
				verdi: '9002',
				visningsnavn: 'Omsorgen for',
			},
			{
				verdi: '9020',
				visningsnavn: 'Omsorgen for',
			},
			{
				verdi: '9099',
				visningsnavn: 'Omsorgen for',
			},
			{
				verdi: '9003',
				visningsnavn: 'Årskvantum',
			},
			{
				verdi: '9004',
				visningsnavn: 'Årskvantum dokumentasjon',
			},
			{
				verdi: '9013',
				visningsnavn: 'Utvidet Rett',
			},
			{
				verdi: '9014',
				visningsnavn: 'Årskvantum',
			},
			{
				verdi: '9015',
				visningsnavn: 'Vurder aldersvilkår barn',
			},
			{
				verdi: '9005',
				visningsnavn: 'Overstyr input beregning',
			},
			{
				verdi: '9006',
				visningsnavn: 'Venter på punsjet søknad',
			},
			{
				verdi: '9007',
				visningsnavn: 'Mangler søknad for periode i inneværende år',
			},
			{
				verdi: '9008',
				visningsnavn: 'Mangler søknad for annen parts periode',
			},
			{
				verdi: '9200',
				visningsnavn: 'Vurder nattevåk og beredskap',
			},
			{
				verdi: '9201',
				visningsnavn: 'Vurder nattevåk og beredskap',
			},
			{
				verdi: '9202',
				visningsnavn: 'Vurder rett etter pleietrengendes død',
			},
			{
				verdi: '9203',
				visningsnavn: 'Bruker har ikke oppgitt alle arbeidsgiverne sine',
			},
			{
				verdi: '9290',
				visningsnavn:
					'En annen sak tilknyttet barnet må behandles frem til uttak, eller besluttes, før denne saken kan behandles videre.',
			},
			{
				verdi: '9300',
				visningsnavn: 'Vurder om institusjonen er godkjent',
			},
			{
				verdi: '9301',
				visningsnavn: 'Vurder om opplæringen er nødvendig for å behandle og ta seg av barnet',
			},
			{
				verdi: '9302',
				visningsnavn: 'Vurder om opplæringen er gjennomgått',
			},
			{
				verdi: '9303',
				visningsnavn: 'Vurder reisetid',
			},
			{
				verdi: '9999',
				visningsnavn: 'Venter på manglende funksjonalitet.',
			},
		],
	},
	{
		område: 'K9',
		kode: 'aktorId',
		visningsnavn: 'Aktor id',
		tolkes_som: 'String',
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: 'ansvarligBeslutter',
		visningsnavn: 'Ansvarlig beslutter',
		tolkes_som: 'String',
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: 'ansvarligSaksbehandler',
		visningsnavn: 'Ansvarlig saksbehandler',
		tolkes_som: 'String',
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: 'avventerAnnet',
		visningsnavn: 'Avventer annet',
		tolkes_som: 'boolean',
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: 'avventerAnnetIkkeSaksbehandlingstid',
		visningsnavn: 'Avventer annet ikke saksbehandlingstid',
		tolkes_som: 'boolean',
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: 'avventerArbeidsgiver',
		visningsnavn: 'Avventer arbeidsgiver',
		tolkes_som: 'boolean',
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: 'avventerSaksbehandler',
		visningsnavn: 'Avventer saksbehandler',
		tolkes_som: 'boolean',
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: 'avventerSøker',
		visningsnavn: 'Avventer søker',
		tolkes_som: 'boolean',
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: 'avventerTekniskFeil',
		visningsnavn: 'Avventer teknisk feil',
		tolkes_som: 'boolean',
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: 'behandlendeEnhet',
		visningsnavn: 'Behandlende enhet',
		tolkes_som: 'String',
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: 'behandlingTypekode',
		visningsnavn: 'Behandling typekode',
		tolkes_som: 'String',
		verdiforklaringerErUttømmende: true,
		verdiforklaringer: [
			{
				verdi: 'BT-002',
				visningsnavn: 'Førstegangsbehandling',
			},
			{
				verdi: 'BT-003',
				visningsnavn: 'Klage',
			},
			{
				verdi: 'BT-004',
				visningsnavn: 'Revurdering',
			},
			{
				verdi: 'BT-006',
				visningsnavn: 'Innsyn',
			},
			{
				verdi: 'BT-007',
				visningsnavn: 'Tilbakekreving',
			},
			{
				verdi: 'BT-008',
				visningsnavn: 'Anke',
			},
			{
				verdi: 'BT-009',
				visningsnavn: 'Tilbakekreving revurdering',
			},
			{
				verdi: 'BT-010',
				visningsnavn: 'Unntaksbehandling',
			},
			{
				verdi: 'PAPIRSØKNAD',
				visningsnavn: 'Papirsøknad',
			},
			{
				verdi: 'PAPIRETTERSENDELSE',
				visningsnavn: 'Papirettersendelse',
			},
			{
				verdi: 'PAPIRINNTEKTSOPPLYSNINGER',
				visningsnavn: 'Papirinntektsopplysninger',
			},
			{
				verdi: 'DIGITAL_ETTERSENDELSE',
				visningsnavn: 'Digital ettersendelse',
			},
			{
				verdi: 'INNLOGGET_CHAT',
				visningsnavn: 'Innlogget chat',
			},
			{
				verdi: 'SKRIV_TIL_OSS_SPØRMSÅL',
				visningsnavn: 'Skriv til oss spørsmål',
			},
			{
				verdi: 'SKRIV_TIL_OSS_SVAR',
				visningsnavn: 'Skriv til oss svar',
			},
			{
				verdi: 'SAMTALEREFERAT',
				visningsnavn: 'Samtalereferat',
			},
			{
				verdi: 'KOPI',
				visningsnavn: 'Kopi',
			},
			{
				verdi: 'INNTEKTSMELDING_UTGÅTT',
				visningsnavn: 'Inntektsmeldinger uten søknad',
			},
			{
				verdi: 'UTEN_FNR_DNR',
				visningsnavn: 'Uten fnr eller dnr',
			},
			{
				verdi: 'UKJENT',
				visningsnavn: 'Ukjent',
			},
		],
	},
	{
		område: 'K9',
		kode: 'behandlingUuid',
		visningsnavn: 'Behandling uuid',
		tolkes_som: 'String',
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: 'behandlingsstatus',
		visningsnavn: 'Behandlingsstatus',
		tolkes_som: 'String',
		verdiforklaringerErUttømmende: true,
		verdiforklaringer: [
			{
				verdi: 'AVSLU',
				visningsnavn: 'Avsluttet',
			},
			{
				verdi: 'FVED',
				visningsnavn: 'Fatter vedtak',
			},
			{
				verdi: 'IVED',
				visningsnavn: 'Iverksetter vedtak',
			},
			{
				verdi: 'OPPRE',
				visningsnavn: 'Opprettet',
			},
			{
				verdi: 'UTRED',
				visningsnavn: 'Utredes',
			},
			{
				verdi: 'VENT',
				visningsnavn: 'Satt på vent',
			},
			{
				verdi: 'LUKKET',
				visningsnavn: 'Lukket',
			},
			{
				verdi: 'SENDT_INN',
				visningsnavn: 'Sendt inn',
			},
		],
	},
	{
		område: 'K9',
		kode: 'behandlingssteg',
		visningsnavn: 'Behandlingssteg',
		tolkes_som: 'String',
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: [
			{
				verdi: 'BERYT',
				visningsnavn: 'Beregn ytelse',
			},
			{
				verdi: 'PRECONDITION_BERGRUNN',
				visningsnavn: 'Vurderer om det er mulig å beregne',
			},
			{
				verdi: 'FAST_BERGRUNN',
				visningsnavn: 'Fastsett beregningsgrunnlag',
			},
			{
				verdi: 'VURDER_OPPTJ_PERIODE',
				visningsnavn: 'Vurder Opptjening Periode',
			},
			{
				verdi: 'FASTSETT_STP_BER',
				visningsnavn: 'Fastsett skjæringstidspunkt beregning',
			},
			{
				verdi: 'FVEDSTEG',
				visningsnavn: 'Fatte Vedtak',
			},
			{
				verdi: 'VURDER_VILKAR_BERGRUNN',
				visningsnavn: 'Vurder beregingsgrunnlagsvilkåret',
			},
			{
				verdi: 'VURDER_REF_BERGRUNN',
				visningsnavn: 'Vurder refusjon for beregningsgrunnlaget',
			},
			{
				verdi: 'FORDEL_BERGRUNN',
				visningsnavn: 'Fordel beregningsgrunnlag',
			},
			{
				verdi: 'FORBRES',
				visningsnavn: 'Foreslå behandlingsresultat',
			},
			{
				verdi: 'FORS_BERGRUNN',
				visningsnavn: 'Foreslå beregningsgrunnlag',
			},
			{
				verdi: 'FORS_BERGRUNN_2',
				visningsnavn: 'Foreslå beregningsgrunnlag del 2',
			},
			{
				verdi: 'VURDER_MANUELT_BREV',
				visningsnavn: 'Vurder manuelt brev',
			},
			{
				verdi: 'FORVEDSTEG',
				visningsnavn: 'Foreslå vedtak',
			},
			{
				verdi: 'BERYT_OPPDRAG',
				visningsnavn: 'Hindre tilbaketrekk',
			},
			{
				verdi: 'VURDER_SØKNADSFRIST',
				visningsnavn: 'Vurder søknadsfrist',
			},
			{
				verdi: 'INIT_PERIODER',
				visningsnavn: 'Start',
			},
			{
				verdi: 'INIT_VILKÅR',
				visningsnavn: 'Initier vilkår for behandling',
			},
			{
				verdi: 'INPER',
				visningsnavn: 'Innhent personopplysninger',
			},
			{
				verdi: 'INREG',
				visningsnavn: 'Innhent registeropplysninger - innledende oppgaver',
			},
			{
				verdi: 'INSØK',
				visningsnavn: 'Innhent søknadsopplysninger',
			},
			{
				verdi: 'INREG_AVSL',
				visningsnavn: 'Innhent registeropplysninger - resterende oppgaver',
			},
			{
				verdi: 'IVEDSTEG',
				visningsnavn: 'Iverksett Vedtak',
			},
			{
				verdi: 'KOFAK',
				visningsnavn: 'Kontroller Fakta',
			},
			{
				verdi: 'KOARB',
				visningsnavn: 'Kontroller arbeidsforhold',
			},
			{
				verdi: 'KOMPLETT_FOR_BEREGNING',
				visningsnavn: 'Opplysninger til beregning',
			},
			{
				verdi: 'KOFAKBER',
				visningsnavn: 'Kontroller fakta for beregning',
			},
			{
				verdi: 'KOFAKUT',
				visningsnavn: 'Kontroller fakta for uttak',
			},
			{
				verdi: 'KOFAK_LOP_MEDL',
				visningsnavn: 'Kontroller løpende medlemskap',
			},
			{
				verdi: 'VURDEROP',
				visningsnavn: 'Kontrollerer søkers opplysningsplikt',
			},
			{
				verdi: 'SIMOPP',
				visningsnavn: 'Simuler oppdrag',
			},
			{
				verdi: 'START',
				visningsnavn: 'Start behandling prosess',
			},
			{
				verdi: 'VRSLREV',
				visningsnavn: 'Varsel om revurdering',
			},
			{
				verdi: 'VULOMED',
				visningsnavn: 'Vurder løpende medlemskap',
			},
			{
				verdi: 'VURDER_FARESIGNALER',
				visningsnavn: 'Vurder faresignaler',
			},
			{
				verdi: 'VURDINNSYN',
				visningsnavn: 'Vurder innsynskrav',
			},
			{
				verdi: 'VURDERKOMPLETT',
				visningsnavn: 'Vurder kompletthet',
			},
			{
				verdi: 'POSTCONDITION_KOMPLETTHET',
				visningsnavn: 'Sjekker om det er mulig å fortsette etter kompletthetssjekk',
			},
			{
				verdi: 'VARIANT_FILTER',
				visningsnavn: 'Filtrer ut varianter',
			},
			{
				verdi: 'VURDER_MEDISINSK',
				visningsnavn: 'Vurder medisinske vilkår',
			},
			{
				verdi: 'VURDER_NODVENDIGHET',
				visningsnavn: 'Vurder nødvendighetens vilkår',
			},
			{
				verdi: 'VURDER_INSTITUSJON',
				visningsnavn: 'Vurder krav til institusjonen',
			},
			{
				verdi: 'VURDER_GJENNOMGATT_OPPLAERING',
				visningsnavn: 'Vurder gjennomgått opplæring',
			},
			{
				verdi: 'POST_MEDISINSK',
				visningsnavn: 'Post vurder medisinskvilkår',
			},
			{
				verdi: 'VURDERMV',
				visningsnavn: 'Vurder medlemskapvilkår',
			},
			{
				verdi: 'VURDER_OMSORG_FOR',
				visningsnavn: 'Vurder omsorgen for',
			},
			{
				verdi: 'VURDER_ALDER',
				visningsnavn: 'Vurder søkers alder',
			},
			{
				verdi: 'VURDER_ALDER_BARN',
				visningsnavn: 'Vurder barnets alder',
			},
			{
				verdi: 'VURDER_OPPTJ_FAKTA',
				visningsnavn: 'Vurder opptjeningfakta',
			},
			{
				verdi: 'VURDER_OPPTJ',
				visningsnavn: 'Vurder opptjeningsvilkåret',
			},
			{
				verdi: 'VURDER_TILBAKETREKK',
				visningsnavn: 'Vurder tilbaketrekk',
			},
			{
				verdi: 'VURDER_UTLAND',
				visningsnavn: 'Vurder utland (SED)',
			},
			{
				verdi: 'VURDER_UTTAK',
				visningsnavn: 'Vurder uttaksvilkår',
			},
			{
				verdi: 'VURDER_UTTAK_V2',
				visningsnavn: 'Uttak',
			},
			{
				verdi: 'BEKREFT_UTTAK',
				visningsnavn: 'Bekreft uttak',
			},
			{
				verdi: 'MANUELL_VILKÅRSVURDERING',
				visningsnavn: 'Manuell vilkårsvurdering',
			},
			{
				verdi: 'MANUELL_TILKJENNING_YTELSE',
				visningsnavn: 'Manuell tilkjenning av ytelse',
			},
			{
				verdi: 'OVERGANG_FRA_INFOTRYGD',
				visningsnavn: 'Direkte overgang fra infotrygd',
			},
		],
	},
	{
		område: 'K9',
		kode: 'fagsystem',
		visningsnavn: 'Fagsystem',
		tolkes_som: 'String',
		verdiforklaringerErUttømmende: true,
		verdiforklaringer: [
			{
				verdi: 'K9SAK',
				visningsnavn: 'K9-sak',
			},
			{
				verdi: 'K9TILBAKE',
				visningsnavn: 'K9-tilbake',
			},
			{
				verdi: 'FPTILBAKE',
				visningsnavn: 'FP-tilbake',
			},
			{
				verdi: 'PUNSJ',
				visningsnavn: 'K9-punsj',
			},
			{
				verdi: 'OMSORGSPENGER',
				visningsnavn: 'Omsorgspenger',
			},
		],
	},
	{
		område: 'K9',
		kode: 'fraEndringsdialog',
		visningsnavn: 'Fra endringsdialog',
		tolkes_som: 'boolean',
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: 'hastesak',
		visningsnavn: 'Hastesak',
		tolkes_som: 'boolean',
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: 'helautomatiskBehandlet',
		visningsnavn: 'Helautomatisk behandlet',
		tolkes_som: 'boolean',
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: 'løsbartAksjonspunkt',
		visningsnavn: 'Aksjonspunkt som kan løses',
		tolkes_som: 'String',
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: [
			{
				verdi: '5009',
				visningsnavn: 'Avklar tilleggsopplysninger',
			},
			{
				verdi: '5015',
				visningsnavn: 'Foreslå vedtak',
			},
			{
				verdi: '5016',
				visningsnavn: 'Fatter vedtak',
			},
			{
				verdi: '5017',
				visningsnavn: 'Vurder søkers opplysningsplikt ved ufullstendig/ikke-komplett søknad',
			},
			{
				verdi: '5018',
				visningsnavn: 'Foreslå vedtak uten totrinnskontroll',
			},
			{
				verdi: '5019',
				visningsnavn: 'Avklar lovlig opphold.',
			},
			{
				verdi: '5020',
				visningsnavn: 'Avklar om bruker er bosatt.',
			},
			{
				verdi: '5021',
				visningsnavn: 'Avklar om bruker har gyldig periode.',
			},
			{
				verdi: '5023',
				visningsnavn: 'Avklar oppholdsrett.',
			},
			{
				verdi: '5026',
				visningsnavn: 'Varsel om revurdering opprettet manuelt',
			},
			{
				verdi: '5028',
				visningsnavn: 'Foreslå vedtak manuelt',
			},
			{
				verdi: '5030',
				visningsnavn: 'Avklar verge',
			},
			{
				verdi: '5033',
				visningsnavn: 'Vurdere annen ytelse før vedtak',
			},
			{
				verdi: '5034',
				visningsnavn: 'Vurdere dokument før vedtak',
			},
			{
				verdi: '5040',
				visningsnavn: 'Vurdere overlappende ytelse før vedtak',
			},
			{
				verdi: '5038',
				visningsnavn: 'Fastsette beregningsgrunnlag for arbeidstaker/frilanser skjønnsmessig',
			},
			{
				verdi: '5039',
				visningsnavn: 'Vurder varig endret/nyoppstartet næring selvstendig næringsdrivende',
			},
			{
				verdi: '5054',
				visningsnavn: 'Vurder varig endret/nyoppstartet næring selvstendig næringsdrivende',
			},
			{
				verdi: '5042',
				visningsnavn: 'Fastsett beregningsgrunnlag for selvstendig næringsdrivende',
			},
			{
				verdi: '5046',
				visningsnavn: 'Fordel beregningsgrunnlag',
			},
			{
				verdi: '5067',
				visningsnavn: 'Fordel beregningsgrunnlag',
			},
			{
				verdi: '5059',
				visningsnavn: 'Vurder refusjon beregningsgrunnlag',
			},
			{
				verdi: '5047',
				visningsnavn: 'Fastsett beregningsgrunnlag for tidsbegrenset arbeidsforhold',
			},
			{
				verdi: '5049',
				visningsnavn: 'Fastsett beregningsgrunnlag for SN som er ny i arbeidslivet',
			},
			{
				verdi: '5050',
				visningsnavn: 'Vurder gradering på andel uten beregningsgrunnlag',
			},
			{
				verdi: '5051',
				visningsnavn: 'Vurder perioder med opptjening',
			},
			{
				verdi: '5052',
				visningsnavn: 'Avklar aktivitet for beregning',
			},
			{
				verdi: '5053',
				visningsnavn: 'Avklar medlemskap.',
			},
			{
				verdi: '5055',
				visningsnavn: 'Vurder varsel ved vedtak til ugunst',
			},
			{
				verdi: '5056',
				visningsnavn: 'Kontroll av manuelt opprettet revurderingsbehandling',
			},
			{
				verdi: '5057',
				visningsnavn: 'Manuell tilkjenning av ytelse',
			},
			{
				verdi: '5058',
				visningsnavn: 'Vurder fakta for arbeidstaker, frilans og selvstendig næringsdrivende',
			},
			{
				verdi: '5068',
				visningsnavn: 'Innhent dokumentasjon fra utenlandsk trygdemyndighet',
			},
			{
				verdi: '5072',
				visningsnavn: 'Søker er stortingsrepresentant/administrativt ansatt i Stortinget',
			},
			{
				verdi: '5080',
				visningsnavn: 'Avklar arbeidsforhold',
			},
			{
				verdi: '5084',
				visningsnavn: 'Vurder feilutbetaling',
			},
			{
				verdi: '5085',
				visningsnavn: 'Sjekk om ytelsesbehandlingen skal utføres før eller etter tilbakekrevingsbehandlingen',
			},
			{
				verdi: '5089',
				visningsnavn: 'Manuell vurdering av opptjeningsvilkår',
			},
			{
				verdi: '5090',
				visningsnavn: 'Vurder tilbaketrekk',
			},
			{
				verdi: '5077',
				visningsnavn: 'Vurder søknadsfrist',
			},
			{
				verdi: '9069',
				visningsnavn: 'Avklar om inntektsmeldinger kreves for å kunne beregne',
			},
			{
				verdi: '9071',
				visningsnavn:
					'Endeling avklaring om inntektsmeldinger kreves for å kunne beregne eller om perioden skal avslås',
			},
			{
				verdi: '6002',
				visningsnavn: 'Saksbehandler initierer kontroll av søkers opplysningsplikt',
			},
			{
				verdi: '6005',
				visningsnavn: 'Overstyring av medlemskapsvilkåret',
			},
			{
				verdi: '6006',
				visningsnavn: 'Overstyring av Søknadsfrist',
			},
			{
				verdi: '6004',
				visningsnavn: 'Overstyring av medisinskvilkår for pleietrengende under 18 år',
			},
			{
				verdi: '6008',
				visningsnavn: 'Overstyring av medisinskvilkår for pleietrengende 18 år',
			},
			{
				verdi: '6003',
				visningsnavn: 'Overstyring av Omsorgen for',
			},
			{
				verdi: '6007',
				visningsnavn: 'Overstyring av beregning',
			},
			{
				verdi: '6011',
				visningsnavn: 'Overstyring av opptjeningsvilkåret',
			},
			{
				verdi: '6014',
				visningsnavn: 'Overstyring av beregningsaktiviteter',
			},
			{
				verdi: '6015',
				visningsnavn: 'Overstyring av beregningsgrunnlag',
			},
			{
				verdi: '6016',
				visningsnavn: 'Overstyring av K9-vilkåret',
			},
			{
				verdi: '6068',
				visningsnavn: 'Manuell markering av utenlandssak',
			},
			{
				verdi: '7001',
				visningsnavn: 'Manuelt satt på vent',
			},
			{
				verdi: '7003',
				visningsnavn: 'Venter på komplett søknad',
			},
			{
				verdi: '7005',
				visningsnavn: 'Satt på vent etter varsel om revurdering',
			},
			{
				verdi: '7006',
				visningsnavn: 'Venter på opptjeningsopplysninger',
			},
			{
				verdi: '7008',
				visningsnavn: 'Satt på vent pga for tidlig søknad',
			},
			{
				verdi: '7009',
				visningsnavn: 'Vent på oppdatering som passerer kompletthetssjekk',
			},
			{
				verdi: '7014',
				visningsnavn: 'Vent på rapporteringsfrist for inntekt',
			},
			{
				verdi: '7019',
				visningsnavn: 'Autopunkt gradering uten beregningsgrunnlag',
			},
			{
				verdi: '7020',
				visningsnavn: 'Vent på siste meldekort for AAP eller DP-mottaker',
			},
			{
				verdi: '7022',
				visningsnavn: 'Vent på ny inntektsmelding med gyldig arbeidsforholdId',
			},
			{
				verdi: '7023',
				visningsnavn: 'Autopunkt militær i opptjeningsperioden og beregninggrunnlag under 3G',
			},
			{
				verdi: '7025',
				visningsnavn: 'Autopunkt gradering flere arbeidsforhold',
			},
			{
				verdi: '7030',
				visningsnavn: 'Vent på etterlyst inntektsmelding',
			},
			{
				verdi: '7035',
				visningsnavn: 'Venter på manglende funksjonalitet, bruker 70år ved refusjonskrav',
			},
			{
				verdi: '9068',
				visningsnavn: 'Vent på etterlyst inntektsmelding',
			},
			{
				verdi: '9070',
				visningsnavn: 'Vent på etterlyst inntektsmelding og/eller tilsvar på varsel om avslag',
			},
			{
				verdi: '7041',
				visningsnavn:
					'Vent på vedtak om lovendring vedrørende beregning av næring i kombinasjon med arbeid eller frilans',
			},
			{
				verdi: '8000',
				visningsnavn: 'Venter på manglende funksjonalitet.',
			},
			{
				verdi: '8003',
				visningsnavn: 'Venter på manglende funksjonalitet.',
			},
			{
				verdi: '8005',
				visningsnavn: 'Arbeidstaker og frilanser i samme organisasjon, kan ikke beregnes.',
			},
			{
				verdi: '8004',
				visningsnavn: 'Saksbehandler overstyrer oppgitt opptjening',
			},
			{
				verdi: '9001',
				visningsnavn: 'Kontroller legeerklæring',
			},
			{
				verdi: '9002',
				visningsnavn: 'Omsorgen for',
			},
			{
				verdi: '9020',
				visningsnavn: 'Omsorgen for',
			},
			{
				verdi: '9099',
				visningsnavn: 'Omsorgen for',
			},
			{
				verdi: '9003',
				visningsnavn: 'Årskvantum',
			},
			{
				verdi: '9004',
				visningsnavn: 'Årskvantum dokumentasjon',
			},
			{
				verdi: '9013',
				visningsnavn: 'Utvidet Rett',
			},
			{
				verdi: '9014',
				visningsnavn: 'Årskvantum',
			},
			{
				verdi: '9015',
				visningsnavn: 'Vurder aldersvilkår barn',
			},
			{
				verdi: '9005',
				visningsnavn: 'Overstyr input beregning',
			},
			{
				verdi: '9006',
				visningsnavn: 'Venter på punsjet søknad',
			},
			{
				verdi: '9007',
				visningsnavn: 'Mangler søknad for periode i inneværende år',
			},
			{
				verdi: '9008',
				visningsnavn: 'Mangler søknad for annen parts periode',
			},
			{
				verdi: '9200',
				visningsnavn: 'Vurder nattevåk og beredskap',
			},
			{
				verdi: '9201',
				visningsnavn: 'Vurder nattevåk og beredskap',
			},
			{
				verdi: '9202',
				visningsnavn: 'Vurder rett etter pleietrengendes død',
			},
			{
				verdi: '9203',
				visningsnavn: 'Bruker har ikke oppgitt alle arbeidsgiverne sine',
			},
			{
				verdi: '9290',
				visningsnavn:
					'En annen sak tilknyttet barnet må behandles frem til uttak, eller besluttes, før denne saken kan behandles videre.',
			},
			{
				verdi: '9291',
				visningsnavn: 'Vurder hvilken dato ny regel for utbetalingsgrad i uttak skal gjelde fra.',
			},
			{
				verdi: '9300',
				visningsnavn: 'Vurder om institusjonen er godkjent',
			},
			{
				verdi: '9301',
				visningsnavn: 'Vurder om opplæringen er nødvendig for å behandle og ta seg av barnet',
			},
			{
				verdi: '9302',
				visningsnavn: 'Vurder om opplæringen er gjennomgått',
			},
			{
				verdi: '9303',
				visningsnavn: 'Vurder reisetid',
			},
			{
				verdi: '9999',
				visningsnavn: 'Venter på manglende funksjonalitet.',
			},
		],
	},
	{
		område: 'K9',
		kode: 'mottattDato',
		visningsnavn: 'Mottatt dato',
		tolkes_som: 'Timestamp',
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: 'nyeKrav',
		visningsnavn: 'Nye krav',
		tolkes_som: 'boolean',
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: null,
		kode: 'oppgavestatus',
		visningsnavn: 'Oppgavestatus',
		tolkes_som: 'String',
		verdiforklaringerErUttømmende: true,
		verdiforklaringer: [
			{
				verdi: 'AAPEN',
				visningsnavn: 'Åpen',
			},
			{
				verdi: 'VENTER',
				visningsnavn: 'Venter',
			},
			{
				verdi: 'LUKKET',
				visningsnavn: 'Lukket',
			},
		],
	},
	{
		område: null,
		kode: 'oppgavetype',
		visningsnavn: 'Oppgavetype',
		tolkes_som: 'String',
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: [],
	},
	{
		område: 'K9',
		kode: 'pleietrengendeAktorId',
		visningsnavn: 'Pleietrengende aktor id',
		tolkes_som: 'String',
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: 'påklagdBehandlingUuid',
		visningsnavn: 'Påklagd behandling uuid',
		tolkes_som: 'String',
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: 'registrertDato',
		visningsnavn: 'Registrert dato',
		tolkes_som: 'Timestamp',
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: 'relatertPartAktorid',
		visningsnavn: 'Relatert part aktorid',
		tolkes_som: 'String',
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: 'resultattype',
		visningsnavn: 'Resultattype',
		tolkes_som: 'String',
		verdiforklaringerErUttømmende: true,
		verdiforklaringer: [
			{
				verdi: 'IKKE_FASTSATT',
				visningsnavn: 'Ikke fastsatt',
			},
			{
				verdi: 'INNVILGET',
				visningsnavn: 'Innvilget',
			},
			{
				verdi: 'DELVIS_INNVILGET',
				visningsnavn: 'Delvis innvilget',
			},
			{
				verdi: 'AVSLÅTT',
				visningsnavn: 'Avslått',
			},
			{
				verdi: 'OPPHØR',
				visningsnavn: 'Opphør',
			},
			{
				verdi: 'HENLAGT_SØKNAD_TRUKKET',
				visningsnavn: 'Henlagt, søknaden er trukket',
			},
			{
				verdi: 'HENLAGT_FEILOPPRETTET',
				visningsnavn: 'Henlagt, søknaden er feilopprettet',
			},
			{
				verdi: 'HENLAGT_BRUKER_DØD',
				visningsnavn: 'Henlagt, brukeren er død',
			},
			{
				verdi: 'MERGET_OG_HENLAGT',
				visningsnavn: 'Mottatt ny søknad',
			},
			{
				verdi: 'HENLAGT_SØKNAD_MANGLER',
				visningsnavn: 'Henlagt søknad mangler',
			},
			{
				verdi: 'HENLAGT_MASKINELT',
				visningsnavn: 'Henlagt maskinelt',
			},
			{
				verdi: 'INNVILGET_ENDRING',
				visningsnavn: 'Endring innvilget',
			},
			{
				verdi: 'INGEN_ENDRING',
				visningsnavn: 'Ingen endring',
			},
			{
				verdi: 'MANGLER_BEREGNINGSREGLER',
				visningsnavn: 'Mangler beregningsregler',
			},
		],
	},
	{
		område: 'K9',
		kode: 'saksnummer',
		visningsnavn: 'Saksnummer',
		tolkes_som: 'String',
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: 'totrinnskontroll',
		visningsnavn: 'Totrinnskontroll',
		tolkes_som: 'boolean',
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: 'vedtaksdato',
		visningsnavn: 'Vedtaksdato',
		tolkes_som: 'Timestamp',
		verdiforklaringerErUttømmende: false,
		verdiforklaringer: null,
	},
	{
		område: 'K9',
		kode: 'ytelsestype',
		visningsnavn: 'Ytelsestype',
		tolkes_som: 'String',
		verdiforklaringerErUttømmende: true,
		verdiforklaringer: [
			{
				verdi: 'PSB',
				visningsnavn: 'Pleiepenger sykt barn',
			},
			{
				verdi: 'OMP',
				visningsnavn: 'Omsorgspenger',
			},
			{
				verdi: 'OMD',
				visningsnavn: 'Omsorgsdager: overføring',
			},
			{
				verdi: 'FRISINN',
				visningsnavn: 'Frisinn',
			},
			{
				verdi: 'PPN',
				visningsnavn: 'Pleiepenger i livets sluttfase',
			},
			{
				verdi: 'OLP',
				visningsnavn: 'Opplæringspenger',
			},
			{
				verdi: 'OMP_KS',
				visningsnavn: 'Omsorgsdager: kronisk syk',
			},
			{
				verdi: 'OMP_MA',
				visningsnavn: 'Omsorgsdager: midlertidig alene',
			},
			{
				verdi: 'OMP_AO',
				visningsnavn: 'Omsorgsdager: alene om omsorg',
			},
			{
				verdi: 'UKJENT',
				visningsnavn: 'Ukjent',
			},
		],
	},
];
