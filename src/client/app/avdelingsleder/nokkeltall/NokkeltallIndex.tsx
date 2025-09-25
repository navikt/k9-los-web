import React from 'react';
import FerdigstiltePerEnhet from 'avdelingsleder/nokkeltall/ferdigstilte-per-enhet/FerdigstiltePerEnhet';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import DagensTall from './dagens-tall/DagensTall';

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
