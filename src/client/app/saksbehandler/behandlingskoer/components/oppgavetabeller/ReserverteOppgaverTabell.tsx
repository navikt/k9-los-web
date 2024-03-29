/* eslint-disable jsx-a11y/no-static-element-interactions */
import { ErrorMessage, Loader, Table } from '@navikt/ds-react';
import apiPaths from 'api/apiPaths';
import { K9LosApiKeys } from 'api/k9LosApi';
import { useSaksbehandlerReservasjoner } from 'api/queries/saksbehandlerQueries';
import useRestApiRunner from 'api/rest-api-hooks/src/local-data/useRestApiRunner';
import Reservasjon from 'avdelingsleder/reservasjoner/reservasjonTsType';
import merknadType from 'kodeverk/merknadType';
import NavFrontendChevron from 'nav-frontend-chevron';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import React, { FunctionComponent, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useQueryClient } from 'react-query';
import ReservasjonV3 from 'saksbehandler/behandlingskoer/ReservasjonV3Dto';
import { getHeaderCodes } from 'saksbehandler/behandlingskoer/components/oppgavetabeller/oppgavetabellerfelles';
import Oppgave from 'saksbehandler/oppgaveTsType';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { OppgaveNøkkel } from 'types/OppgaveNøkkel';
import kopanelStyles from '../oppgavekoPanel.css';
import OppgaveTabellMenyAntallOppgaver from './OppgaveTabellMenyAntallOppgaver';
import ReservertOppgaveRadV1 from './ReservertOppgaveRadV1';
import ReservertOppgaveRadV3 from './ReservertOppgaveRadV3';
import styles from './oppgaverTabell.css';

interface OwnProps {
	apneOppgave: (oppgave: Oppgave) => void;
	gjelderHastesaker?: boolean;
}

const ReserverteOppgaverTabell: FunctionComponent<OwnProps> = ({ apneOppgave, gjelderHastesaker }) => {
	const [valgtOppgaveId, setValgtOppgaveId] = useState<string>();
	const [visReservasjoner, setVisReservasjoner] = useState(true);
	const {
		data: reservasjoner,
		isLoading,
		isSuccess,
		isError,
	} = useSaksbehandlerReservasjoner({
		select: (reserverteOppgaverData: ReservasjonV3[]): ReservasjonV3[] => {
			if (gjelderHastesaker) {
				return reserverteOppgaverData.filter(
					(reservasjon) => !!reservasjon?.reservertOppgaveV1Dto?.merknad?.merknadKoder?.includes(merknadType.HASTESAK),
				);
			}
			return reserverteOppgaverData.filter(
				(reservasjon) => !reservasjon?.reservertOppgaveV1Dto?.merknad?.merknadKoder?.includes(merknadType.HASTESAK),
			);
		},
	});
	const queryClient = useQueryClient();

	const { startRequest: leggTilBehandletOppgave } = useRestApiRunner(K9LosApiKeys.LEGG_TIL_BEHANDLET_OPPGAVE);
	const { startRequest: forlengOppgavereservasjon } = useRestApiRunner<Reservasjon[]>(
		K9LosApiKeys.FORLENG_OPPGAVERESERVASJON,
	);

	const forlengOppgaveReservasjonFn = (oppgaveNøkkel: OppgaveNøkkel) => {
		forlengOppgavereservasjon({ oppgaveNøkkel }).then(() => {
			queryClient.invalidateQueries(apiPaths.saksbehandlerReservasjoner);
		});
	};
	const ref = useRef({});

	const goToFagsak = (oppgave: Oppgave) => {
		leggTilBehandletOppgave(oppgave.oppgaveNøkkel);
		apneOppgave(oppgave);
	};

	const countReservations = (reservasjon: ReservasjonV3) => {
		if (reservasjon.reservertOppgaveV1Dto) {
			return 1;
		}
		if (reservasjon.reserverteV3Oppgaver.length > 0) {
			return reservasjon.reserverteV3Oppgaver.length;
		}
		return 0;
	};

	const antallReservasjoner =
		reservasjoner?.reduce((previousValue, reservasjon) => previousValue + countReservations(reservasjon), 0) || 0;

	return (
		<>
			<button
				type="button"
				className={kopanelStyles.behandlingskoerKnapp}
				onClick={() => setVisReservasjoner(!visReservasjoner)}
			>
				<NavFrontendChevron type={visReservasjoner ? 'ned' : 'høyre'} className={kopanelStyles.chevron} />
				<Element>
					<FormattedMessage
						id={gjelderHastesaker ? 'OppgaverTabell.ReserverteHastesaker' : 'OppgaverTabell.ReserverteOppgaver'}
					/>
				</Element>
				{isSuccess && (
					<OppgaveTabellMenyAntallOppgaver
						antallOppgaver={antallReservasjoner}
						tekstId={
							gjelderHastesaker
								? 'OppgaverTabell.ReserverteHastesakerAntall'
								: 'OppgaverTabell.ReserverteOppgaverAntall'
						}
						hastesak={gjelderHastesaker}
					/>
				)}
			</button>
			{isLoading && visReservasjoner && <Loader size="large" className={styles.spinner} />}
			{isError && visReservasjoner && <ErrorMessage>Noe gikk galt ved lasting av reservasjoner</ErrorMessage>}
			{antallReservasjoner === 0 && isSuccess && visReservasjoner && (
				<>
					<VerticalSpacer eightPx />
					<Normaltekst>
						{!gjelderHastesaker ? (
							<FormattedMessage id="OppgaverTabell.IngenReserverteOppgaver" />
						) : (
							<FormattedMessage id="OppgaverTabell.IngenReserverteHastesaker" />
						)}
					</Normaltekst>
				</>
			)}
			{antallReservasjoner > 0 && isSuccess && visReservasjoner && (
				<Table>
					<Table.Header>
						<Table.Row>
							{getHeaderCodes(true, gjelderHastesaker)
								.filter(Boolean)
								.map((header) => (
									<Table.HeaderCell key={header}>
										{!header.includes('EMPTY') ? <FormattedMessage id={header} /> : ''}
									</Table.HeaderCell>
								))}
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{reservasjoner.map((reservasjon) =>
							reservasjon.reservertOppgaveV1Dto ? (
								<ReservertOppgaveRadV1
									key={reservasjon.reservertOppgaveV1Dto.eksternId}
									reservasjon={reservasjon}
									goToFagsak={goToFagsak}
									forlengOppgaveReservasjonFn={forlengOppgaveReservasjonFn}
									valgtOppgaveId={valgtOppgaveId}
									setValgtOppgaveId={setValgtOppgaveId}
									gjelderHastesaker={gjelderHastesaker}
									ref={ref}
								/>
							) : (
								reservasjon.reserverteV3Oppgaver?.map((oppgave) => (
									<ReservertOppgaveRadV3
										key={oppgave.oppgaveNøkkel.oppgaveEksternId}
										oppgave={oppgave}
										reservasjon={reservasjon}
										forlengOppgaveReservasjonFn={forlengOppgaveReservasjonFn}
										valgtOppgaveId={valgtOppgaveId}
										setValgtOppgaveId={setValgtOppgaveId}
										gjelderHastesaker={gjelderHastesaker}
										ref={ref}
									/>
								))
							),
						)}
					</Table.Body>
				</Table>
			)}
		</>
	);
};

export default ReserverteOppgaverTabell;
