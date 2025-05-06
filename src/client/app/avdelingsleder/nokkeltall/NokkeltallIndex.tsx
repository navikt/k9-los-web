import React from 'react';
import DagensTall from 'avdelingsleder/nokkeltall/dagens-tall/DagensTall';
import FerdigstiltePerEnhet from 'avdelingsleder/nokkeltall/ferdigstilte-per-enhet/FerdigstiltePerEnhet';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';

function NokkeltallIndex() {
	return (
		<div className="flex-grow-0 w-full">
			<DagensTall />
			<VerticalSpacer twentyPx />
			<FerdigstiltePerEnhet />
		</div>
	);
}

export default NokkeltallIndex;
