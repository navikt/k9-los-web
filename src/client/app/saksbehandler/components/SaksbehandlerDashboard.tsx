import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { Box } from '@navikt/ds-react';
import { useInnloggetSaksbehandler } from 'api/queries/saksbehandlerQueries';
import type { FunctionComponent } from 'react';
import SisteOppgaver from 'saksbehandler/saksstotte/components/SisteOppgaver';
import SaksbehandlerNøkkeltall from 'saksbehandler/saksstotte/nokkeltall/SaksbehandlerNøkkeltall';
import { Søkeboks } from 'saksbehandler/sokeboks/Søkeboks';
import BehandlingskoerIndex from '../behandlingskoer/BehandlingskoerIndex';
import styles from './saksbehandlerDashboard.module.css';

export const SaksbehandlerDashboard: FunctionComponent = () => {
	const { data: saksbehandler } = useInnloggetSaksbehandler();

	return (
		<div>
			<div className={styles.oppgaveContainer}>
				<div className={styles.gridContainer}>
					<div className={styles.leftColumn}>
						<Box background="raised" borderRadius="4" padding="space-16" className={styles.sakslistePanel}>
							<Søkeboks />
						</Box>
						{saksbehandler.finnesISaksbehandlerTabell && (
							<div>
								<Box background="raised" borderRadius="4" padding="space-16" className={styles.sakslistePanel}>
									<BehandlingskoerIndex />
								</Box>
							</div>
						)}
					</div>
					<div className={styles.rightColumn}>
						<Box background="raised" borderRadius="4" padding="space-16">
							<SisteOppgaver />
							<VerticalSpacer twentyPx />
							<SaksbehandlerNøkkeltall />
						</Box>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SaksbehandlerDashboard;
