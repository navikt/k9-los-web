import React, { useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import { Normaltekst } from 'nav-frontend-typografi';
import { Checkbox, Loader, Table, TextField } from '@navikt/ds-react';
import { RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import AlleKodeverk from 'kodeverk/alleKodeverkTsType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { getDateAndTime } from 'utils/dateUtils';
import { useAvdelingslederReservasjoner } from 'api/queries/avdelingslederQueries';
import ReservasjonV3, {
	MappedReservasjon,
	mapReservasjonV3Array,
} from 'saksbehandler/behandlingskoer/ReservasjonV3Dto';
import { getKodeverknavnFraKode } from 'utils/kodeverkUtils';
import useGlobalStateRestApiData from '../../../api/rest-api-hooks/src/global-data/useGlobalStateRestApiData';
import * as styles from './reservasjonerTabell.css';
import ReservasjonRowExpandableContent from './ReservasjonRowExpandableContent';

const sorterMedReservertAv = (reservasjonerListe: MappedReservasjon[]) =>
	reservasjonerListe?.sort((reservasjon1, reservasjon2) =>
		reservasjon1.reservertAvIdent.localeCompare(reservasjon2.reservertAvIdent),
	);

const ReservasjonerTabell = () => {
	const [reservasjonerSomSkalVises, setReservasjonerSomSkalVises] = useState<MappedReservasjon[]>([]);
	const [finnesSokResultat, setFinnesSokResultat] = useState(true);

	const {
		data: reservasjoner,
		isLoading,
		isSuccess,
	} = useAvdelingslederReservasjoner({
		select: (reservasjonerData: ReservasjonV3[]): MappedReservasjon[] =>
			sorterMedReservertAv(mapReservasjonV3Array(reservasjonerData)),
		onSuccess: (data: MappedReservasjon[]) => {
			setReservasjonerSomSkalVises(data);
		},
	});

	const alleKodeverk: AlleKodeverk = useGlobalStateRestApiData(RestApiGlobalStatePathsKeys.KODEVERK);

	const sokEtterReservasjon = (e) => {
		const sokVerdi = e.target.value.toLowerCase();
		const reservasjonerMedMatch = reservasjoner.filter(
			(res) =>
				res.reservertAvEpost.toLowerCase().includes(sokVerdi) ||
				res.saksnummer?.toLowerCase()?.includes(sokVerdi) ||
				res.journalpostId?.toLowerCase()?.includes(sokVerdi),
		);
		if (reservasjonerMedMatch.length > 0) {
			setFinnesSokResultat(true);
			setReservasjonerSomSkalVises(reservasjonerMedMatch);
		} else {
			setFinnesSokResultat(false);
		}
	};
	const debounceFn = useCallback(_.debounce(sokEtterReservasjon, 300), [reservasjoner]);

	return (
		<>
			<div className={styles.titelContainer}>
				<b>
					<FormattedMessage id="ReservasjonerTabell.Reservasjoner" />
					{reservasjoner?.length > 0 && isSuccess && ` (${reservasjoner.length} stk)`}
				</b>
				<div className={styles.sokfelt}>
					<TextField onChange={debounceFn} label="Søk på reservasjon" />
				</div>
			</div>
			<VerticalSpacer sixteenPx />
			{isLoading && <Loader size="2xlarge" className={styles.spinner} />}
			{reservasjoner?.length > 0 && isSuccess && !finnesSokResultat && (
				<>
					<VerticalSpacer eightPx />
					<Normaltekst>
						<FormattedMessage id="ReservasjonerTabell.IngenMatchandeReservasjoner" />
					</Normaltekst>
					<VerticalSpacer eightPx />
				</>
			)}
			{reservasjoner?.length === 0 && isSuccess && (
				<>
					<VerticalSpacer eightPx />
					<Normaltekst>
						<FormattedMessage id="ReservasjonerTabell.IngenReservasjoner" />
					</Normaltekst>
					<VerticalSpacer eightPx />
				</>
			)}
			{reservasjonerSomSkalVises?.length > 0 && finnesSokResultat && (
				<Table>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell scope="col" />
							<Table.HeaderCell scope="col">Navn</Table.HeaderCell>
							<Table.HeaderCell scope="col">Id</Table.HeaderCell>
							<Table.HeaderCell scope="col">Type</Table.HeaderCell>
							<Table.HeaderCell scope="col">Reservert til</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{reservasjonerSomSkalVises.map((reservasjon) => (
							<Table.ExpandableRow
								key={`${reservasjon.oppgaveNøkkel.oppgaveEksternId} ${reservasjon.saksnummer} ${reservasjon.journalpostId}`}
								content={<ReservasjonRowExpandableContent reservasjon={reservasjon} />}
							>
								<Table.DataCell>{reservasjon.reservertAvEpost}</Table.DataCell>
								<Table.DataCell>{reservasjon.saksnummer || reservasjon.journalpostId}</Table.DataCell>
								<Table.DataCell>
									{getKodeverknavnFraKode(
										reservasjon.behandlingstype.kode,
										kodeverkTyper.BEHANDLING_TYPE,
										alleKodeverk,
									) + (reservasjon ? ' - [B] ' : '')}
								</Table.DataCell>
								<Table.DataCell>
									<FormattedMessage
										id="ReservasjonerTabell.ReservertTilFormat"
										values={getDateAndTime(reservasjon.reservertTil)}
									/>
								</Table.DataCell>
								<Table.DataCell>
									<Checkbox hideLabel />
								</Table.DataCell>
							</Table.ExpandableRow>
						))}
					</Table.Body>
				</Table>
			)}
		</>
	);
};

export default ReservasjonerTabell;
