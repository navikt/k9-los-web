import React, { FunctionComponent, useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Chevron from 'nav-frontend-chevron';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Loader } from '@navikt/ds-react';
import { K9LosApiKeys } from 'api/k9LosApi';
import useKodeverk from 'api/rest-api-hooks/src/global-data/useKodeverk';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import UtvalgskriterierForOppgavekoForm from 'avdelingsleder/behandlingskoer/components/oppgavekoForm/UtvalgskriterierForOppgavekoForm';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import DateLabel from 'sharedComponents/DateLabel';
import Table from 'sharedComponents/Table';
import TableColumn from 'sharedComponents/TableColumn';
import TableRow from 'sharedComponents/TableRow';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { Oppgaveko } from '../oppgavekoTsType';
import SletteOppgavekoModal from './SletteOppgavekoModal';
import * as styles from './gjeldendeOppgavekoerTabell.module.css';

const headerTextCodes = [
	'GjeldendeOppgavekoerTabell.Listenavn',
	'GjeldendeOppgavekoerTabell.Stonadstype',
	'GjeldendeOppgavekoerTabell.AntallSaksbehandlere',
	'GjeldendeOppgavekoerTabell.AntallBehandlinger',
	'GjeldendeOppgavekoerTabell.SistEndret',
	'EMPTY_1',
];

interface OwnProps {
	oppgavekoer: Oppgaveko[];
	setValgtOppgavekoId: (id: string) => void;
	resetValgtOppgavekoId: () => void;
	valgtOppgavekoId?: string;
	requestFinished: boolean;
	hentAlleOppgavekoer: () => void;
}

const wait = (ms) =>
	new Promise((resolve) => {
		setTimeout(resolve, ms);
	});

/**
 * GjeldendeOppgavekoerTabell
 * @deprecated
 */
export const GjeldendeOppgavekoerTabell: FunctionComponent<OwnProps> = ({
	oppgavekoer,
	valgtOppgavekoId,
	setValgtOppgavekoId,
	requestFinished,
	hentAlleOppgavekoer,
	resetValgtOppgavekoId,
}) => {
	const [visSlettModal, setVisSlettModal] = useState(false);
	const [valgtKo, setValgtKo] = useState(undefined);
	const { startRequest: fjernOppgaveko } = useRestApiRunner(K9LosApiKeys.SLETT_OPPGAVEKO);
	const { startRequest: hentOppgaveko } = useRestApiRunner<Oppgaveko>(K9LosApiKeys.HENT_OPPGAVEKO);

	const { startRequest: lagNyOppgaveko } = useRestApiRunner<{ id: string }>(K9LosApiKeys.OPPRETT_NY_OPPGAVEKO);

	const hentOppgaveKoFn = (id: string) => {
		hentOppgaveko({ id }).then((ko) => setValgtKo(ko));
	};

	const lagNyOppgavekoFn = useCallback(() => {
		lagNyOppgaveko().then((data) => {
			setValgtOppgavekoId(data.id);
			hentAlleOppgavekoer();
			hentOppgaveKoFn(data.id);
		});
	}, []);

	const fagsakYtelseTyper = useKodeverk(kodeverkTyper.FAGSAK_YTELSE_TYPE);

	const setValgtOppgaveko = async (event: Event, id: string) => {
		// Må vente 100 ms før en byttar oppgavekø i tabell. Dette fordi lagring av navn skjer som blur-event. Så i tilfellet
		// der en endrer navn og så trykker direkte på en annen oppgavekø vil ikke lagringen skje før etter at ny kø er valgt.
		await wait(100);

		if (valgtOppgavekoId !== id) {
			setValgtOppgavekoId(id);
			hentOppgaveKoFn(id);
		} else {
			setValgtOppgavekoId(undefined);
		}
	};

	const closeSletteModal = () => {
		setVisSlettModal(false);
	};

	const fjernOppgavekoFn = useCallback((oppgaveko: Oppgaveko): void => {
		closeSletteModal();
		fjernOppgaveko({ id: oppgaveko.id }).then(() => {
			resetValgtOppgavekoId();
			hentAlleOppgavekoer();
		});
	}, []);

	const lagNyOppgavekoOnKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
		if (event.keyCode === 13) {
			lagNyOppgavekoFn();
		}
	};

	const lagNyOppgavekoOnClick = () => {
		lagNyOppgavekoFn();
	};

	const visFjernOppgavekoModal = () => {
		setVisSlettModal(true);
	};

	const antallFagytelseTyper = 6;
	const formatStonadstyper = (valgteFagsakYtelseTyper?: string[]) => {
		if (
			!valgteFagsakYtelseTyper ||
			valgteFagsakYtelseTyper.length === 0 ||
			valgteFagsakYtelseTyper.length >= antallFagytelseTyper
		) {
			return <FormattedMessage id="GjeldendeOppgavekoerTabell.Alle" />;
		}

		return valgteFagsakYtelseTyper
			.map((fyt) => {
				const type = fagsakYtelseTyper.find((def) => def.kode === fyt);
				return type ? type.navn : '';
			})
			.join(', ');
	};

	return (
		<>
			{requestFinished && (
				<Button
					tabIndex={0}
					onClick={lagNyOppgavekoOnClick}
					onKeyDown={(e) => lagNyOppgavekoOnKeyDown(e)}
					icon={<PlusCircleIcon />}
				>
					Legg til ny oppgavekø
				</Button>
			)}
			{oppgavekoer.length === 0 && !requestFinished && <Loader size="2xlarge" className={styles.spinner} />}
			{oppgavekoer.length === 0 && requestFinished && (
				<>
					<VerticalSpacer eightPx />
					<BodyShort size="small">
						<FormattedMessage id="GjeldendeOppgavekoerTabell.IngenLister" />
					</BodyShort>
					<VerticalSpacer eightPx />
				</>
			)}
			{oppgavekoer.length > 0 && (
				<div className="mt-8">
					<Table headerTextCodes={headerTextCodes}>
						{oppgavekoer.map((oppgaveko) => (
							<React.Fragment key={oppgaveko.id}>
								<TableRow
									className={oppgaveko.id === valgtOppgavekoId ? styles.isSelected : styles.notSelected}
									id={oppgaveko.id}
									onMouseDown={setValgtOppgaveko}
									onKeyDown={setValgtOppgaveko}
								>
									<TableColumn>{oppgaveko.navn}</TableColumn>
									<TableColumn>{formatStonadstyper(oppgaveko.fagsakYtelseTyper)}</TableColumn>
									<TableColumn>
										{oppgaveko.saksbehandlere.length > 0 ? oppgaveko.saksbehandlere.length : ''}
									</TableColumn>
									<TableColumn>{`${oppgaveko.antallUreserverteOppgaver} ${
										oppgaveko.antallBehandlinger ? `(${oppgaveko.antallBehandlinger})` : ''
									}`}</TableColumn>
									<TableColumn>
										<DateLabel dateString={oppgaveko.sistEndret} />
									</TableColumn>
									<TableColumn>
										<Chevron
											key={oppgaveko.id}
											type={valgtOppgavekoId && valgtOppgavekoId === oppgaveko.id ? 'opp' : 'ned'}
											className={styles.chevron}
										/>
									</TableColumn>
								</TableRow>

								{valgtKo && valgtOppgavekoId === oppgaveko.id && (
									<td colSpan={6}>
										<br />
										<UtvalgskriterierForOppgavekoForm
											valgtOppgaveko={valgtKo}
											hentKo={hentOppgaveKoFn}
											hentAlleOppgavekoer={hentAlleOppgavekoer}
											visModal={visFjernOppgavekoModal}
										/>
									</td>
								)}

								{visSlettModal && (
									<SletteOppgavekoModal valgtOppgaveko={valgtKo} cancel={closeSletteModal} submit={fjernOppgavekoFn} />
								)}
							</React.Fragment>
						))}
					</Table>
				</div>
			)}
		</>
	);
};

export default GjeldendeOppgavekoerTabell;
