export enum SORTERING_ALTERNATIVER {
	mottattDatoEldstTilNyest = 'mottattDatoEldstTilNyest',
	mottattDatoNyestTilEldst = 'mottattDatoNyestTilEldst',
	feilutbetaltBeløpSynkende = 'feilutbetaltBeløpSynkende',
	feilutbetalingsdatoEldstTilNyest = 'feilutbetalingsdatoSynkende',
	førsteGangHosBeslutterEldstTilNyest = 'førsteGangHosBeslutterEldstTilNyest',
}

const koder = {
	mottattDato: 'mottattDato',
	førsteFeilutbetalingDato: 'førsteFeilutbetalingDato',
	feilutbetaltBeløp: 'feilutbetaltBeløp',
	tidFørsteGangHosBeslutter: 'tidFørsteGangHosBeslutter',
};
export const mapKodeTilSorteringParams = (kode: SORTERING_ALTERNATIVER) => {
	switch (kode) {
		case SORTERING_ALTERNATIVER.mottattDatoEldstTilNyest:
			return {
				kode: koder.mottattDato,
				område: 'K9',
				økende: true,
			};
		case SORTERING_ALTERNATIVER.mottattDatoNyestTilEldst:
			return {
				kode: koder.mottattDato,
				område: 'K9',
				økende: false,
			};
		case SORTERING_ALTERNATIVER.feilutbetaltBeløpSynkende:
			return {
				kode: koder.feilutbetaltBeløp,
				område: 'K9',
				økende: false,
			};
		case SORTERING_ALTERNATIVER.feilutbetalingsdatoEldstTilNyest:
			return {
				kode: koder.førsteFeilutbetalingDato,
				område: 'K9',
				økende: true,
			};
		case SORTERING_ALTERNATIVER.førsteGangHosBeslutterEldstTilNyest:
			return {
				kode: koder.tidFørsteGangHosBeslutter,
				område: 'K9',
				økende: true,
			};

		default:
			return null;
	}
};

export const mapSorteringParamsTilKode = ({
	område,
	kode,
	økende,
}: {
	område: string | null;
	kode: string;
	økende: boolean;
}) => {
	if (område !== 'K9') return null;
	switch (kode) {
		case koder.mottattDato:
			return økende ? SORTERING_ALTERNATIVER.mottattDatoEldstTilNyest : SORTERING_ALTERNATIVER.mottattDatoNyestTilEldst;
		case koder.førsteFeilutbetalingDato:
			return SORTERING_ALTERNATIVER.feilutbetalingsdatoEldstTilNyest;
		case koder.feilutbetaltBeløp:
			return SORTERING_ALTERNATIVER.feilutbetaltBeløpSynkende;
		case koder.tidFørsteGangHosBeslutter:
			return SORTERING_ALTERNATIVER.førsteGangHosBeslutterEldstTilNyest;
		default:
			return null;
	}
};
