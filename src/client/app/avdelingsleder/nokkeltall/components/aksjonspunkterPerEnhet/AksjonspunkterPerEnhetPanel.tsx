import React, { FunctionComponent, useState } from 'react';
import { useIntl } from 'react-intl';
import { useQuery } from '@tanstack/react-query';
import { Loader } from '@navikt/ds-react';
import { Error } from 'app/errorTsType';
import apiPaths from 'api/apiPaths';
import GrafContainer from 'avdelingsleder/GrafContainer';
import AksjonspunkterPerEnhetType from 'avdelingsleder/nokkeltall/AksjonspunkterPerEnhetType';
import { ALLE_YTELSETYPER_VALGT, UKE_2 } from 'avdelingsleder/nokkeltall/nokkeltallUtils';
import { getValueFromLocalStorage } from 'utils/localStorageHelper';
import AksjonspunkterPerEnhetDiagram from './AksjonspunkterPerEnhetDiagram';

const AksjonspunkterPerEnhetPanel: FunctionComponent = () => {
	const id = 'aksjonspunkterPerEnhet';
	const {
		data: aksjonspunkterPerEnhet,
		isLoading,
		error,
	}: { data: AksjonspunkterPerEnhetType[]; isLoading: boolean; error: Error } = useQuery({
		queryKey: [apiPaths.aksjonspunkterPerEnhet],
	});

	const [valgtYtelseType, setValgtYtelseType] = useState<string>(
		getValueFromLocalStorage(`${id}-ytelsestype`) || ALLE_YTELSETYPER_VALGT,
	);

	const [antallUkerSomSkalVises, setAntallUkerSomSkalVises] = useState<string>(
		getValueFromLocalStorage(`${id}-uker`) || UKE_2,
	);

	const intl = useIntl();

	const aksjonspunktPerEnhetVisning = () => {
		if (isLoading) {
			return <Loader size="large" />;
		}

		if (error) {
			return <>Noe gikk galt under lasting</>;
		}

		const aksjonspunkterPerEnhetMappet = aksjonspunkterPerEnhet.map((v) => ({
			...v,
			behandlendeEnhet: v.behandlendeEnhet ? v.behandlendeEnhet.replace('NAV', 'Nav') : v.behandlendeEnhet,
		}));

		return (
			<AksjonspunkterPerEnhetDiagram
				aksjonspunkterPerEnhet={aksjonspunkterPerEnhetMappet}
				valgtYtelseType={valgtYtelseType}
				antallUkerSomSkalVises={antallUkerSomSkalVises}
			/>
		);
	};
	return (
		<GrafContainer
			id={id}
			valgtYtelseType={valgtYtelseType}
			antallUkerSomSkalVises={antallUkerSomSkalVises}
			setValgtYtelseType={setValgtYtelseType}
			setAntallUkerSomSkalVises={setAntallUkerSomSkalVises}
			tittel={intl.formatMessage({ id: 'AksjonspunkterPerEnhet.Tittel' })}
		>
			{aksjonspunktPerEnhetVisning()}
		</GrafContainer>
	);
};
export default AksjonspunkterPerEnhetPanel;
