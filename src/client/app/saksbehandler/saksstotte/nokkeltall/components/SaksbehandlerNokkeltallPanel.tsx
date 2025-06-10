import React, { FunctionComponent } from 'react';
import NyeOgFerdigstilteOppgaver from 'saksbehandler/saksstotte/nokkeltall/components/nyeOgFerdigstilteOppgaverTsType';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import NyeOgFerdigstilteOppgaverForIdagPanel from './nyeOgFerdigstilteOppgaverForIdag/NyeOgFerdigstilteOppgaverForIdagPanel';
import NyeOgFerdigstilteOppgaverForSisteSyvPanel from './nyeOgFerdigstilteOppgaverForSisteSyv/NyeOgFerdigstilteOppgaverForSisteSyvPanel';

interface OwnProps {
	nyeOgFerdigstilteOppgaver: NyeOgFerdigstilteOppgaver[];
}

/**
 * SaksbehandlerNokkeltallPanel.
 */
const SaksbehandlerNokkeltallPanel: FunctionComponent<OwnProps> = ({ nyeOgFerdigstilteOppgaver }) => {
	const height = 300;

	return (
		<div>
			<NyeOgFerdigstilteOppgaverForIdagPanel nyeOgFerdigstilteOppgaver={nyeOgFerdigstilteOppgaver} />
			<VerticalSpacer sixteenPx />
			<NyeOgFerdigstilteOppgaverForSisteSyvPanel
				height={height}
				nyeOgFerdigstilteOppgaver={nyeOgFerdigstilteOppgaver}
			/>
		</div>
	);
};

export default SaksbehandlerNokkeltallPanel;
