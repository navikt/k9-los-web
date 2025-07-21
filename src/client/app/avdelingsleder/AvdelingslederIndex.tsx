import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router';
import classnames from 'classnames/bind';
import Panel from 'nav-frontend-paneler';
import Tabs from 'nav-frontend-tabs';
import { BarChartIcon, CircleSlashIcon, FileSearchIcon, PersonGroupIcon, TasklistIcon } from '@navikt/aksel-icons';
import { Heading } from '@navikt/ds-react';
import useTrackRouteParam from 'app/data/trackRouteParam';
import { getPanelLocationCreator } from 'app/paths';
import { useInnloggetSaksbehandler } from 'api/queries/saksbehandlerQueries';
import { LagredeSøk } from 'avdelingsleder/lagredeSøk/LagredeSøk';
import NokkeltallIndex from 'avdelingsleder/nokkeltall/NokkeltallIndex';
import Status from 'avdelingsleder/status/Status';
import { StatusFordeling } from 'avdelingsleder/statusfordeling/StatusFordeling';
import Image from 'sharedComponents/Image';
import LoadingPanel from 'sharedComponents/LoadingPanel';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { parseQueryString } from 'utils/urlUtils';
import FeatureSwitch from '../FeatureSwitch';
import * as styles from './avdelingslederIndex.css';
import AvdelingslederPanels from './avdelingslederPanels';
import BehandlingskoerIndex from './behandlingskoerV3/BehandlingskoerIndex';
import SaksbehandlereTabell from './bemanning/components/SaksbehandlereTabell';
import AvdelingslederDashboard from './components/AvdelingslederDashboard';
import IkkeTilgangTilAvdelingslederPanel from './components/IkkeTilgangTilAvdelingslederPanel';
import ReservasjonerTabell from './reservasjoner/components/ReservasjonerTabellV1';

const classNames = classnames.bind(styles);

const renderAvdelingslederPanel = (avdelingslederPanel) => {
	switch (avdelingslederPanel) {
		case AvdelingslederPanels.BEHANDLINGSKOER_V3:
			return <BehandlingskoerIndex />;
		case AvdelingslederPanels.LAGREDE_SØK:
			return <LagredeSøk />;
		case AvdelingslederPanels.NOKKELTALL:
			return <NokkeltallIndex />;
		case AvdelingslederPanels.RESERVASJONER:
			return <ReservasjonerTabell />;
		case AvdelingslederPanels.SAKSBEHANDLERE:
			return <SaksbehandlereTabell />;
		default:
			return null;
	}
};

const messageId = {
	[AvdelingslederPanels.BEHANDLINGSKOER_V3]: 'AvdelingslederIndex.Behandlingskoer.V3',
	[AvdelingslederPanels.LAGREDE_SØK]: 'AvdelingslederIndex.LagredeSøk',
	[AvdelingslederPanels.NOKKELTALL]: 'AvdelingslederIndex.Nokkeltall',
	[AvdelingslederPanels.RESERVASJONER]: 'AvdelingslederIndex.Reservasjoner',
	[AvdelingslederPanels.SAKSBEHANDLERE]: 'AvdelingslederIndex.Saksbehandlere',
};

const tabStyle = {
	[AvdelingslederPanels.BEHANDLINGSKOER_V3]: [<TasklistIcon fontSize="1.5rem" />, <TasklistIcon fontSize="1.5rem" />],
	[AvdelingslederPanels.LAGREDE_SØK]: [<FileSearchIcon fontSize="1.5rem" />, <FileSearchIcon fontSize="1.5rem" />],
	[AvdelingslederPanels.NOKKELTALL]: [<BarChartIcon fontSize="1.5rem" />, <BarChartIcon fontSize="1.5rem" />],
	[AvdelingslederPanels.RESERVASJONER]: [<CircleSlashIcon fontSize="1.5rem" />, <CircleSlashIcon fontSize="1.5rem" />],
	[AvdelingslederPanels.SAKSBEHANDLERE]: [<PersonGroupIcon fontSize="1.5rem" />, <PersonGroupIcon fontSize="1.5rem" />],
};

type TabProps = {
	label: React.ReactNode;
	aktiv: boolean;
	linkCreator: (props: { children: React.ReactNode; className: string }) => React.ReactNode;
};

const getTab = (
	avdelingslederPanel: string,
	activeAvdelingslederPanel: string,
	getAvdelingslederPanelLocation: (panel: string) => string,
): TabProps => {
	const isActive = avdelingslederPanel === activeAvdelingslederPanel;
	const icon = isActive ? tabStyle[avdelingslederPanel][0] : tabStyle[avdelingslederPanel][1];

	return {
		label: (
			<div className={styles.tabLabel}>
				{typeof icon === 'string' ? <Image className={styles.tabIcon} src={icon} /> : icon}
				<Heading size="small">
					<FormattedMessage id={messageId[avdelingslederPanel]} />
				</Heading>
			</div>
		),
		aktiv: isActive,
		linkCreator: ({ children, className }) => (
			<NavLink
				to={getAvdelingslederPanelLocation(avdelingslederPanel)}
				className={classNames(className, 'link', { isActive })}
			>
				{children}
			</NavLink>
		),
	};
};

/**
 * AvdelingslederIndex
 */
export const AvdelingslederIndex: FunctionComponent = () => {
	const { selected: activeAvdelingslederPanelTemp, location } = useTrackRouteParam({
		paramName: 'fane',
		isQueryParam: true,
	});

	const getPanelFromUrlOrDefault = (loc) => {
		const panelFromUrl = parseQueryString(loc.search);
		return panelFromUrl.avdelingsleder ? panelFromUrl.avdelingsleder : AvdelingslederPanels.BEHANDLINGSKOER_V3;
	};

	const { data: innnloggetSaksbehandler } = useInnloggetSaksbehandler();

	const getAvdelingslederPanelLocation = getPanelLocationCreator(location);
	const activeAvdelingslederPanel = activeAvdelingslederPanelTemp || getPanelFromUrlOrDefault(location);

	if (!innnloggetSaksbehandler.kanOppgavestyre) {
		return <IkkeTilgangTilAvdelingslederPanel />;
	}

	if (activeAvdelingslederPanel) {
		return (
			<div className="max-w-[1400px] p-4">
				<Heading size="large">Avdelingslederpanel</Heading>
				<VerticalSpacer eightPx />
				<FeatureSwitch
					defaultValue={false}
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
				<VerticalSpacer twentyPx />
				<AvdelingslederDashboard>
					<div>
						<Tabs
							tabs={[
								getTab(
									AvdelingslederPanels.BEHANDLINGSKOER_V3,
									activeAvdelingslederPanel,
									getAvdelingslederPanelLocation,
								),
								getTab(AvdelingslederPanels.LAGREDE_SØK, activeAvdelingslederPanel, getAvdelingslederPanelLocation),
								getTab(AvdelingslederPanels.NOKKELTALL, activeAvdelingslederPanel, getAvdelingslederPanelLocation),
								getTab(AvdelingslederPanels.RESERVASJONER, activeAvdelingslederPanel, getAvdelingslederPanelLocation),
								getTab(AvdelingslederPanels.SAKSBEHANDLERE, activeAvdelingslederPanel, getAvdelingslederPanelLocation),
							].filter(Boolean)}
						/>
						<Panel className={styles.panelPadding}>{renderAvdelingslederPanel(activeAvdelingslederPanel)}</Panel>
					</div>
				</AvdelingslederDashboard>
			</div>
		);
	}
	return <LoadingPanel />;
};

export default AvdelingslederIndex;
