import behandlingType from 'kodeverk/behandlingType';

const punsjBehandlingstyper = [
	behandlingType.PAPIRSØKNAD,
	behandlingType.PAPIRETTERSENDELSE,
	behandlingType.PAPIRINNTEKTSOPPLYSNINGER,
	behandlingType.DIGITAL_ETTERSENDELSE,
	behandlingType.INNLOGGET_CHAT,
	behandlingType.SKRIV_TIL_OSS_SPØRMSÅL,
	behandlingType.SKRIV_TIL_OSS_SVAR,
	behandlingType.SAMTALEREFERAT,
	behandlingType.UKJENT,
	behandlingType.KOPI,
	behandlingType.INNTEKTSMELDING_UTGÅTT,
	behandlingType.UTEN_FNR_DNR,
];

export default punsjBehandlingstyper;
