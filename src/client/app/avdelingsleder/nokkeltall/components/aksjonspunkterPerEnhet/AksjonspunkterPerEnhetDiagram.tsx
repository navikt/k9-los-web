import React from 'react';
import { fargerForLegendsForAksjonspunkterPerEnhet } from 'styles/echartStyle';
import Stolpediagram from 'avdelingsleder/Stolpediagram';
import AksjonspunkterPerEnhetType from 'avdelingsleder/nokkeltall/AksjonspunkterPerEnhetType';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import OppgaveSystem from '../../../../types/OppgaveSystem';

interface OwnProps {
	aksjonspunkterPerEnhet: AksjonspunkterPerEnhetType[];
	valgtYtelseType: string;
	antallUkerSomSkalVises: string;
}

const AksjonspunkterPerEnhetDiagram = ({
	aksjonspunkterPerEnhet,
	valgtYtelseType,
	antallUkerSomSkalVises,
}: OwnProps) => {
	const PSBBehandlinger: AksjonspunkterPerEnhetType[] = aksjonspunkterPerEnhet.filter(
		(behandling) =>
			behandling.fagsakYtelseType === fagsakYtelseType.PLEIEPENGER_SYKT_BARN &&
			behandling.fagsystemType !== OppgaveSystem.PUNSJ,
	);

	const OMPBehandlinger: AksjonspunkterPerEnhetType[] = aksjonspunkterPerEnhet.filter(
		(behandling) =>
			behandling.fagsakYtelseType === fagsakYtelseType.OMSORGSPENGER &&
			behandling.fagsystemType !== OppgaveSystem.PUNSJ,
	);

	const LivetsSluttfaseBehandlinger: AksjonspunkterPerEnhetType[] = aksjonspunkterPerEnhet.filter(
		(behandling) =>
			behandling.fagsakYtelseType === fagsakYtelseType.PPN && behandling.fagsystemType !== OppgaveSystem.PUNSJ,
	);

	const OMDBehandlinger: AksjonspunkterPerEnhetType[] = aksjonspunkterPerEnhet.filter(
		(behandling) =>
			(behandling.fagsakYtelseType === fagsakYtelseType.OMSORGSDAGER ||
				behandling.fagsakYtelseType === fagsakYtelseType.OMSORGSDAGER_KRONISKSYK ||
				behandling.fagsakYtelseType === fagsakYtelseType.OMSORGSDAGER_ALENEOMOMSORGEN ||
				behandling.fagsakYtelseType === fagsakYtelseType.OMSORGSDAGER_MIDLERTIDIGALENE) &&
			behandling.fagsystemType !== OppgaveSystem.PUNSJ,
	);

	const PunsjBehandlinger: AksjonspunkterPerEnhetType[] = aksjonspunkterPerEnhet.filter(
		(behandling) => behandling?.fagsystemType === OppgaveSystem.PUNSJ,
	);

	const AlleBehandlingerUtomPunsj: AksjonspunkterPerEnhetType[] = aksjonspunkterPerEnhet.filter(
		(behandling) => behandling.fagsystemType !== OppgaveSystem.PUNSJ,
	);

	const hentBehandlingerKnyttetTilYtelseType = () => {
		switch (valgtYtelseType) {
			case fagsakYtelseType.PLEIEPENGER_SYKT_BARN:
				return PSBBehandlinger;
			case fagsakYtelseType.OMSORGSPENGER:
				return OMPBehandlinger;
			case fagsakYtelseType.OMSORGSDAGER:
				return OMDBehandlinger;
			case fagsakYtelseType.PPN:
				return LivetsSluttfaseBehandlinger;
			case fagsakYtelseType.PUNSJ:
				return PunsjBehandlinger;
			default:
				return AlleBehandlingerUtomPunsj;
		}
	};

	const behandlinger = hentBehandlingerKnyttetTilYtelseType().map((behandling) =>
		behandling.behandlendeEnhet ? behandling : { ...behandling, behandlendeEnhet: 'UKJENT' },
	);
	const unikeEnheter = [...new Set(behandlinger.map((behandling) => behandling.behandlendeEnhet))];
	const series = unikeEnheter.map((enhet) => ({
		name: enhet,
		type: 'bar',
		data: behandlinger.filter((behandling) => behandling.behandlendeEnhet === enhet),
		itemStyle: fargerForLegendsForAksjonspunkterPerEnhet[enhet]
			? { color: fargerForLegendsForAksjonspunkterPerEnhet[enhet] }
			: undefined,
	}));

	return <Stolpediagram series={series} uker={antallUkerSomSkalVises} labels={unikeEnheter} />;
};

export default AksjonspunkterPerEnhetDiagram;
