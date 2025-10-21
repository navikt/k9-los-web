import React, { FunctionComponent, useContext, useState } from 'react';
import NavFrontendChevron from 'nav-frontend-chevron';
import { ExclamationmarkTriangleIcon } from '@navikt/aksel-icons';
import { Button, Heading, Label, Modal } from '@navikt/ds-react';
import { usePlukkOppgaveMutation, useSisteOppgaverMutation } from 'api/queries/saksbehandlerQueries';
import BehandlingskoerContext from 'saksbehandler/BehandlingskoerContext';
import ReserverteOppgaverTabell from 'saksbehandler/behandlingskoer/components/oppgavetabeller/ReserverteOppgaverTabell';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { getKoId } from '../utils';
import OppgavekoVelgerForm from './OppgavekoVelgerForm';
import * as styles from './oppgavekoPanel.css';
import { OppgavetabellV3 } from './oppgavetabeller/OppgavetabellV3';

const OppgavekoPanel: FunctionComponent = () => {
	const [visBehandlingerIKo, setVisBehandlingerIKo] = useState<boolean>(false);
	const { valgtOppgavekoId, oppgavekoer } = useContext(BehandlingskoerContext);
	const [visFinnesIngenBehandlingerIKoModal, setVisFinnesIngenBehandlingerIKoModal] = useState<boolean>(false);
	const { mutateAsync: leggTilSisteOppgaver } = useSisteOppgaverMutation();
	const { mutate, isPending: loadingOppgaveFraKo } = usePlukkOppgaveMutation((reservasjoner) => {
		if (reservasjoner.length > 0) {
			const { oppgaveNøkkelDto, oppgavebehandlingsUrl } = reservasjoner[0];
			leggTilSisteOppgaver(oppgaveNøkkelDto).finally(() => window.location.assign(oppgavebehandlingsUrl));
		} else {
			setVisFinnesIngenBehandlingerIKoModal(true);
		}
	});

	const plukkNyOppgave = () => {
		mutate({
			oppgaveKøId: getKoId(valgtOppgavekoId),
		});
	};

	const valgtOppgaveko = oppgavekoer.find((s) => valgtOppgavekoId === `${s.id}`);
	const lukkFinnesIngenBehandlingerIKoModal = () => setVisFinnesIngenBehandlingerIKoModal(false);
	return (
		<div className={styles.container}>
			<Heading size="small">
				Oppgavekøer
			</Heading>
			<VerticalSpacer sixteenPx />
			<OppgavekoVelgerForm plukkNyOppgave={plukkNyOppgave} loadingOppgaveFraKo={loadingOppgaveFraKo} />
			<VerticalSpacer twentyPx />
			<div className={styles.behandlingskoerContainer}>
				<ReserverteOppgaverTabell />
			</div>
			<VerticalSpacer eightPx />
			{visFinnesIngenBehandlingerIKoModal && (
				<Modal
					className="min-w-[500px]"
					open
					onClose={lukkFinnesIngenBehandlingerIKoModal}
					header={{ heading: 'Ingen flere ureserverte oppgaver i køen', icon: <ExclamationmarkTriangleIcon /> }}
				>
					<Modal.Body>
						Det ser ut til at det ikke er flere ureserverte behandlinger i den valgte køen. Prøv å velge en annen kø for
						å fortsette.
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={lukkFinnesIngenBehandlingerIKoModal}>Lukk</Button>
					</Modal.Footer>
				</Modal>
			)}
			<div className={styles.behandlingskoerContainer}>
				<button
					type="button"
					className={styles.behandlingskoerKnapp}
					onClick={() => setVisBehandlingerIKo(!visBehandlingerIKo)}
				>
					<NavFrontendChevron type={visBehandlingerIKo ? 'ned' : 'høyre'} className={styles.chevron} />
					<Label>
						Neste oppgaver
					</Label>
				</button>

				{visBehandlingerIKo && valgtOppgaveko && <OppgavetabellV3 køId={valgtOppgavekoId} />}
			</div>
		</div>
	);
};

export default OppgavekoPanel;
