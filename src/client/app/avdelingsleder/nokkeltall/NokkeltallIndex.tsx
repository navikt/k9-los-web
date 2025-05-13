import React from 'react';
import AksjonspunkterPerEnhetPanel from 'avdelingsleder/nokkeltall/components/aksjonspunkterPerEnhet/AksjonspunkterPerEnhetPanel';
import InngangOgFerdigstiltePanel from 'avdelingsleder/nokkeltall/components/dagensTallPanel/InngangOgFerdigstiltePanel';
import DagensTall from 'avdelingsleder/nokkeltall/dagens-tall/DagensTall';
import FerdigstiltePerEnhet from 'avdelingsleder/nokkeltall/ferdigstilte-per-enhet/FerdigstiltePerEnhet';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import FeatureSwitch from '../../FeatureSwitch';

function NokkeltallIndex() {
	return (
		<FeatureSwitch
			defaultValue={false}
			enabled={
				<div className="flex-grow-0 w-full">
					<DagensTall />
					<VerticalSpacer twentyPx />
					<FerdigstiltePerEnhet />
				</div>
			}
			disabled={
				<div className="flex-grow-0 w-full">
					<InngangOgFerdigstiltePanel />
					<VerticalSpacer twentyPx />
					<AksjonspunkterPerEnhetPanel />
				</div>
			}
			switchLabel="Vis nye nøkkeltall"
			helpText={
				<>
					<p>Dette er funksjonalitet under utvikling.</p>
					<p>
						Nøkkeltallene produseres her fra ny kø- og oppgavemodell. I de nye nøkkeltallene telles ferdigstilte
						behandlinger i stedet for aksjonspunkter.
					</p>
				</>
			}
		/>
	);
}

export default NokkeltallIndex;
