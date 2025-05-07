import React, { FunctionComponent, ReactNode, useContext, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { BodyShort, Button, ReadMore, Select, Skeleton } from '@navikt/ds-react';
import apiPaths from 'api/apiPaths';
import { useAntallOppgaverIKoV3UtenReserverte } from 'api/queries/saksbehandlerQueries';
import BehandlingskoerContext from 'saksbehandler/BehandlingskoerContext';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { OppgavekøV3MedNavn } from 'types/OppgavekøV3Type';
import {
	getValueFromLocalStorage,
	removeValueFromLocalStorage,
	setValueInLocalStorage,
} from 'utils/localStorageHelper';
import { Saksbehandler } from '../saksbehandlerTsType';
import { getKoId } from '../utils';
import OppsummeringAvKø from './OppusmmeringAvKø';
import * as styles from './oppgavekoVelgerForm.css';

interface OwnProps {
	plukkNyOppgave: () => void;
}

const createTooltip = (saksbehandlere: Saksbehandler[]): ReactNode | undefined => {
	if (!saksbehandlere || saksbehandlere.length === 0) {
		return undefined;
	}

	return (
		<div>
			{saksbehandlere
				.sort((n1, n2) => n1.epost.localeCompare(n2.epost))
				.map((s) => (
					<li key={s.epost}>{s.navn ? s.navn : s.epost}</li>
				))}
		</div>
	);
};

const getValgtOppgaveko = (oppgavekoer: Array<OppgavekøV3MedNavn>, oppgavekoId: string) =>
	oppgavekoer.find((s) => oppgavekoId === s.id);

const getDefaultOppgaveko = (oppgavekoer: Array<OppgavekøV3MedNavn>) => {
	const lagretOppgavekoId = getValueFromLocalStorage('id');
	if (lagretOppgavekoId) {
		if (oppgavekoer.some((s) => s.id === lagretOppgavekoId)) {
			return lagretOppgavekoId;
		}
		removeValueFromLocalStorage('id');
	}

	const sortertOppgavekoer = oppgavekoer.sort((oppgaveko1, oppgaveko2) =>
		oppgaveko1.navn.localeCompare(oppgaveko2.navn),
	);
	return sortertOppgavekoer.length > 0 ? sortertOppgavekoer[0].id : undefined;
};

/**
 * OppgavekoVelgerForm
 *
 */
export const OppgavekoVelgerForm: FunctionComponent<OwnProps> = ({ plukkNyOppgave }) => {
	const { oppgavekoer, valgtOppgavekoId, setValgtOppgavekoId } = useContext(BehandlingskoerContext);
	const queryClient = useQueryClient();
	const intl = useIntl();

	const oppgavekoerSortertAlfabetisk = oppgavekoer.sort((a, b) => a.navn.localeCompare(b.navn));
	const harKoer = !!oppgavekoerSortertAlfabetisk.length;
	const valgtKoId = getDefaultOppgaveko(oppgavekoerSortertAlfabetisk);
	const { data: antallIValgtKø, isLoading: isLoadingAntallIValgtKø } = useAntallOppgaverIKoV3UtenReserverte(
		getKoId(valgtKoId),
		{
			enabled: harKoer && valgtKoId !== undefined,
		},
	);

	const { data: saksbehandlereV3 } = useQuery<Saksbehandler[]>({
		queryKey: [apiPaths.hentSaksbehandlereIKoV3(getKoId(valgtKoId))],
		enabled: harKoer && valgtKoId !== undefined,
	});

	useEffect(() => {
		if (oppgavekoerSortertAlfabetisk.length > 0) {
			const defaultOppgavekoId = getDefaultOppgaveko(oppgavekoerSortertAlfabetisk);
			if (defaultOppgavekoId) {
				setValgtOppgavekoId(defaultOppgavekoId);
				queryClient
					.invalidateQueries({ queryKey: [apiPaths.hentSaksbehandlereIKoV3(getKoId(defaultOppgavekoId))] })
					.then();
			}
		}
	}, []);

	const handleSelectKo = (event) => {
		const koId = event.target.value;
		setValgtOppgavekoId(koId);
		setValueInLocalStorage('id', koId);
	};

	if (!harKoer) {
		return (
			<div>
				<BodyShort size="small">Fant ingen oppgavekøer for saksbehandler.</BodyShort>
			</div>
		);
	}

	const antallIKø = antallIValgtKø?.antallUtenReserverte;
	return (
		<div className={styles.oppgavevelgerform_container}>
			<div className="flex">
				<div className="w-[260px] flex-shrink-0 flex-grow-0 mr-8">
					<Select
						label={intl.formatMessage({ id: 'OppgavekoVelgerForm.Oppgaveko' })}
						value={valgtOppgavekoId}
						onChange={handleSelectKo}
					>
						{oppgavekoerSortertAlfabetisk.map((oppgaveko) => (
							<option key={oppgaveko.id} value={`${oppgaveko.id}`}>
								{oppgaveko.navn}
							</option>
						))}
					</Select>
					<VerticalSpacer eightPx />
					{isLoadingAntallIValgtKø && <Skeleton width={120} />}
					{antallIKø !== undefined && (
						<FormattedMessage id="OppgavekoVelgerForm.AntallOppgaver" values={{ antall: antallIKø }} />
					)}
					<ReadMore size="small" header="Saksbehandlere i køen">
						{createTooltip(saksbehandlereV3)}
					</ReadMore>
					<VerticalSpacer sixteenPx />
					<Button id="frode sin knapp" className="mt-4 max-w-sm" onClick={() => plukkNyOppgave()}>
						{intl.formatMessage({ id: 'OppgavekoVelgerForm.PlukkNyOppgave' })}
					</Button>
				</div>
				{valgtOppgavekoId && <OppsummeringAvKø oppgavekø={getValgtOppgaveko(oppgavekoer, valgtOppgavekoId)} />}
			</div>
		</div>
	);
};

export default OppgavekoVelgerForm;
