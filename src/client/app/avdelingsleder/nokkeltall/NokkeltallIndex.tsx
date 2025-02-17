import React from 'react';
import AksjonspunkterPerEnhetPanel from 'avdelingsleder/nokkeltall/components/aksjonspunkterPerEnhet/AksjonspunkterPerEnhetPanel';
import InngangOgFerdigstiltePanel from 'avdelingsleder/nokkeltall/components/dagensTallPanel/InngangOgFerdigstiltePanel';
import DagensTall from 'avdelingsleder/nokkeltall/dagens-tall/DagensTall';
import FerdigstiltePerEnhet from 'avdelingsleder/nokkeltall/ferdigstilte-per-enhet/FerdigstiltePerEnhet';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';

function NokkeltallIndex() {
	return (
		<div>
			<InngangOgFerdigstiltePanel />
			<VerticalSpacer twentyPx />
			<AksjonspunkterPerEnhetPanel />
			<VerticalSpacer twentyPx />
			<DagensTall />
			<VerticalSpacer twentyPx />
			<FerdigstiltePerEnhet />
		</div>
	);
}

export default NokkeltallIndex;
