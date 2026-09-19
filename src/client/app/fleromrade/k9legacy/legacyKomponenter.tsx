import AvdelingslederNøkkeltall from 'avdelingsleder/nokkeltall/NokkeltallIndex';
import Status from 'avdelingsleder/status/Status';
import { StatusFordeling } from 'avdelingsleder/statusfordeling/StatusFordeling';
import SaksbehandlerNøkkeltall from 'saksbehandler/saksstotte/nokkeltall/SaksbehandlerNøkkeltall';
import FeatureSwitch from '../../FeatureSwitch';
import { KunK9Legacy } from './KunK9Legacy';

/*
 * K9-komponenter som fortsatt bruker legacy-API, og som gjenstår å føre over. Hver komponent rendres bare for K9.
 * Se også dokumentet om flerområdestøtte for status på overføringen.
 */

/** Nye og ferdigstilte oppgaver siste sju dager. Legacy-API: `nye-og-ferdigstilte`. */
export const LegacySaksbehandlerNøkkeltall = () => (
	<KunK9Legacy>
		<SaksbehandlerNøkkeltall />
	</KunK9Legacy>
);

/** Statuslinjen øverst i avdelingslederpanelet. Legacy-API: `nokkeltall/status` og `nokkeltall/statusfordeling`. */
export const LegacyAvdelingslederStatus = () => (
	<KunK9Legacy>
		<FeatureSwitch
			defaultValue={true}
			enabled={<StatusFordeling />}
			disabled={<Status />}
			switchLabel="Vis ny statuslinje"
			helpText={
				<>
					<p>Dette er funksjonalitet under utvikling.</p>
					<p>Hensikten med den nye statuslinjen er å bedre se fordelingen på oppgavestatus.</p>
				</>
			}
		/>
	</KunK9Legacy>
);

/**
 * Innholdet i nøkkeltall-fanen i avdelingslederpanelet. Legacy-API: `nokkeltall/dagens-tall` og
 * `nokkeltall/ferdigstilte-per-enhet`. Fanen vises bare når `useVisK9Legacy()` er sann.
 */
export const LegacyAvdelingslederNøkkeltall = () => (
	<KunK9Legacy>
		<AvdelingslederNøkkeltall />
	</KunK9Legacy>
);
