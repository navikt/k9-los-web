import React from 'react';
import { IntlShape, useIntl } from 'react-intl';
import moment from 'moment';
import { RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import { useGlobalStateRestApiData } from 'api/rest-api-hooks';
import AlleKodeverk from 'kodeverk/alleKodeverkTsType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import LabelWithHeader from 'sharedComponents/LabelWithHeader';
import { FlexColumn } from 'sharedComponents/flexGrid';
import { OppgavekøV3MedNavn } from 'types/OppgavekøV3Type';
import { DDMMYYYY_DATE_FORMAT } from 'utils/formats';
import { getKodeverknavnFraKode } from 'utils/kodeverkUtils';
import { OppgavekøV1 } from '../oppgavekoTsType';

const getStonadstyper = (intl: IntlShape, alleKodeverk: AlleKodeverk, oppgaveko?: OppgavekøV1) =>
	oppgaveko && oppgaveko.fagsakYtelseTyper.length > 0
		? oppgaveko.fagsakYtelseTyper.map((type) =>
				getKodeverknavnFraKode(type, kodeverkTyper.FAGSAK_YTELSE_TYPE, alleKodeverk),
			)
		: [intl.formatMessage({ id: 'OppgavekoVelgerForm.Alle' })];

const getBehandlingstyper = (intl: IntlShape, alleKodeverk: AlleKodeverk, oppgaveko?: OppgavekøV1) =>
	oppgaveko && oppgaveko.behandlingTyper.length > 0
		? oppgaveko.behandlingTyper.map((type) => getKodeverknavnFraKode(type, kodeverkTyper.BEHANDLING_TYPE, alleKodeverk))
		: [intl.formatMessage({ id: 'OppgavekoVelgerForm.Alle' })];

const getAndreKriterier = (intl: IntlShape, oppgaveko?: OppgavekøV1) => {
	if (oppgaveko && oppgaveko.andreKriterier.length > 0) {
		return oppgaveko.andreKriterier.map((ak) =>
			ak.inkluder
				? ak.andreKriterierType.navn
				: intl.formatMessage({ id: 'OppgavekoVelgerForm.Uten' }, { kriterie: ak.andreKriterierType.navn }),
		);
	}
	return [intl.formatMessage({ id: 'OppgavekoVelgerForm.Alle' })];
};

const getSorteringsnavn = (intl: IntlShape, oppgaveko?: OppgavekøV1) => {
	if (!oppgaveko || !oppgaveko.sortering) {
		return '';
	}
	const { sorteringType, fomDato, tomDato } = oppgaveko.sortering;
	let values = {
		br: <br />,
		fomDato: undefined,
		tomDato: undefined,
		navn: undefined,
	};

	if (!fomDato && !tomDato) {
		return sorteringType.navn;
	}
	values = {
		navn: sorteringType.navn,
		fomDato: fomDato ? moment(fomDato).format(DDMMYYYY_DATE_FORMAT) : undefined,
		tomDato: tomDato ? moment(tomDato).format(DDMMYYYY_DATE_FORMAT) : undefined,
		br: <br />,
	};

	if (!values.fomDato) {
		return intl.formatMessage({ id: 'OppgavekoVelgerForm.SorteringsinfoTom' }, values) as string;
	}
	if (!values.tomDato) {
		return intl.formatMessage({ id: 'OppgavekoVelgerForm.SorteringsinfoFom' }, values) as string;
	}
	return intl.formatMessage({ id: 'OppgavekoVelgerForm.Sorteringsinfo' }, values) as string;
};

interface OwnProps {
	oppgaveko: OppgavekøV1 | OppgavekøV3MedNavn;
}
/**
 * @deprecated
 */
const OldOppsummeringAvKø = ({ oppgaveko }: OwnProps) => {
	const intl = useIntl();

	const alleKodeverk: AlleKodeverk = useGlobalStateRestApiData(RestApiGlobalStatePathsKeys.KODEVERK);
	if (!oppgaveko || 'tittel' in oppgaveko) {
		return null;
	}

	return (
		<>
			<FlexColumn className="mr-8">
				<LabelWithHeader
					header={intl.formatMessage({ id: 'OppgavekoVelgerForm.Stonadstype' })}
					texts={getStonadstyper(intl, alleKodeverk, oppgaveko)}
				/>
			</FlexColumn>
			<FlexColumn className="mr-8">
				<LabelWithHeader
					header={intl.formatMessage({
						id: 'OppgavekoVelgerForm.Behandlingstype',
					})}
					texts={getBehandlingstyper(intl, alleKodeverk, oppgaveko)}
				/>
			</FlexColumn>
			<FlexColumn>
				<LabelWithHeader
					header={intl.formatMessage({
						id: 'OppgavekoVelgerForm.AndreKriterier',
					})}
					texts={getAndreKriterier(intl, oppgaveko)}
				/>
				<div className="mt-4">
					<LabelWithHeader
						header={intl.formatMessage({ id: 'OppgavekoVelgerForm.Sortering' })}
						texts={[getSorteringsnavn(intl, oppgaveko)]}
					/>
				</div>
			</FlexColumn>
		</>
	);
};

export default OldOppsummeringAvKø;
