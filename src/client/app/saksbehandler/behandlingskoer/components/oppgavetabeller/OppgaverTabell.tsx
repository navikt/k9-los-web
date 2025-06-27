import { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { BodyShort, ErrorMessage, Loader } from '@navikt/ds-react';
import { useSaksbehandlerNesteTiV1 } from 'api/queries/saksbehandlerQueries';
import { getHeaderCodes } from 'saksbehandler/behandlingskoer/components/oppgavetabeller/oppgavetabellerfelles';
import { OppgavekøV1 } from 'saksbehandler/behandlingskoer/oppgavekoTsType';
import { getKoId } from 'saksbehandler/behandlingskoer/utils';
import DateLabel from 'sharedComponents/DateLabel';
import Table from 'sharedComponents/Table';
import TableColumn from 'sharedComponents/TableColumn';
import TableRow from 'sharedComponents/TableRow';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { OppgavekøV3MedNavn } from 'types/OppgavekøV3Type';
import * as styles from './oppgaverTabell.module.css';

interface OwnProps {
	valgtKo: OppgavekøV1 | OppgavekøV3MedNavn;
}

/**
 * OppgaverTabell
 */
export const OppgaverTabell: FunctionComponent<OwnProps> = ({ valgtKo }) => {
	const { data: oppgaverTilBehandling, error, isLoading, isSuccess } = useSaksbehandlerNesteTiV1(getKoId(valgtKo.id));

	if (isLoading) {
		return <Loader size="2xlarge" className={styles.spinner} />;
	}
	if (error) {
		return (
			<ErrorMessage>
				<FormattedMessage id="OppgaverTabell.KunneIkkeHenteOppgaver" />
			</ErrorMessage>
		);
	}

	if (isSuccess && oppgaverTilBehandling.length === 0) {
		return (
			<>
				<VerticalSpacer eightPx />
				<BodyShort size="small">
					<FormattedMessage id="OppgaverTabell.IngenOppgaver" />
				</BodyShort>
			</>
		);
	}

	if (!oppgaverTilBehandling) {
		return null;
	}

	return (
		<div>
			<Table headerTextCodes={getHeaderCodes().filter(Boolean)}>
				{oppgaverTilBehandling?.map((oppgave) => (
					<TableRow key={oppgave.eksternId} model={oppgave} className={styles.oppgavetabell_row}>
						<TableColumn>{oppgave.navn ? `${oppgave.navn} ${oppgave.personnummer}` : '<navn>'}</TableColumn>
						<TableColumn>{oppgave.journalpostId || oppgave.saksnummer}</TableColumn>
						<TableColumn>{oppgave.behandlingstype.navn}</TableColumn>
						<TableColumn>
							{oppgave.opprettetTidspunkt && <DateLabel dateString={oppgave.opprettetTidspunkt} />}
						</TableColumn>
					</TableRow>
				))}
			</Table>
		</div>
	);
};

export default OppgaverTabell;
