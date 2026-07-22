import React, { FunctionComponent } from 'react';
import { NavLink } from 'react-router';
import classnames from 'classnames/bind';
import { Location } from 'history';
import { BarChartIcon, CircleSlashIcon, FileSearchIcon, PersonGroupIcon, TasklistIcon } from '@navikt/aksel-icons';
import { Box, Heading } from '@navikt/ds-react';
import useTrackRouteParam from 'app/data/trackRouteParam';
import { getPanelLocationCreator } from 'app/paths';
import { useInnloggetSaksbehandler } from 'api/queries/saksbehandlerQueries';
import { LagredeSøk } from 'avdelingsleder/lagredeSøk/LagredeSøk';
import NokkeltallIndex from 'avdelingsleder/nokkeltall/NokkeltallIndex';
import AvdelingslederReservasjonerTabell from 'avdelingsleder/reservasjoner/components/AvdelingslederReservasjonerTabell';
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
import IkkeTilgang from './components/IkkeTilgang';

const classNames = classnames.bind(styles);

const renderAvdelingslederPanel = (avdelingslederPanel: string) => {
	switch (avdelingslederPanel) {
		case AvdelingslederPanels.BEHANDLINGSKOER_V3:
			return <BehandlingskoerIndex />;
		case AvdelingslederPanels.LAGREDE_SØK:
			return <LagredeSøk />;
		case AvdelingslederPanels.NOKKELTALL:
			return <NokkeltallIndex />;
		case AvdelingslederPanels.RESERVASJONER:
			return <AvdelingslederReservasjonerTabell />;
		case AvdelingslederPanels.SAKSBEHANDLERE:
			return <SaksbehandlereTabell />;
		default:
			return null;
	}
};

const tabLabels = {
	[AvdelingslederPanels.BEHANDLINGSKOER_V3]: 'Oppgavekøer',
	[AvdelingslederPanels.LAGREDE_SØK]: 'Lagrede søk',
	[AvdelingslederPanels.NOKKELTALL]: 'Nøkkeltall',
	[AvdelingslederPanels.RESERVASJONER]: 'Reservasjoner',
	[AvdelingslederPanels.SAKSBEHANDLERE]: 'Saksbehandlere',
};

const tabStyle = {
	[AvdelingslederPanels.BEHANDLINGSKOER_V3]: [
		<TasklistIcon key="behandlingskoer-active" fontSize="1.5rem" />,
		<TasklistIcon key="behandlingskoer-inactive" fontSize="1.5rem" />,
	],
	[AvdelingslederPanels.LAGREDE_SØK]: [
		<FileSearchIcon key="lagredesok-active" fontSize="1.5rem" />,
		<FileSearchIcon key="lagredesok-inactive" fontSize="1.5rem" />,
	],
	[AvdelingslederPanels.NOKKELTALL]: [
		<BarChartIcon key="nokkeltall-active" fontSize="1.5rem" />,
		<BarChartIcon key="nokkeltall-inactive" fontSize="1.5rem" />,
	],
	[AvdelingslederPanels.RESERVASJONER]: [
		<CircleSlashIcon key="reservasjoner-active" fontSize="1.5rem" />,
		<CircleSlashIcon key="reservasjoner-inactive" fontSize="1.5rem" />,
	],
	[AvdelingslederPanels.SAKSBEHANDLERE]: [
		<PersonGroupIcon key="saksbehandlere-active" fontSize="1.5rem" />,
		<PersonGroupIcon key="saksbehandlere-inactive" fontSize="1.5rem" />,
	],
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
				<Heading size="small">{tabLabels[avdelingslederPanel]}</Heading>
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

	const getPanelFromUrlOrDefault = (loc: Location) => {
		const panelFromUrl = parseQueryString(loc.search);
		return panelFromUrl.avdelingsleder ? panelFromUrl.avdelingsleder : AvdelingslederPanels.BEHANDLINGSKOER_V3;
	};

	const { data: innnloggetSaksbehandler } = useInnloggetSaksbehandler();

	const getAvdelingslederPanelLocation = getPanelLocationCreator(location);
	const activeAvdelingslederPanel = activeAvdelingslederPanelTemp || getPanelFromUrlOrDefault(location);

	if (!innnloggetSaksbehandler.kanOppgavestyre) {
		return <IkkeTilgang />;
	}

	if (activeAvdelingslederPanel) {
		return (
			<div className="max-w-[1400px] p-4">
				<Heading size="large">Avdelingslederpanel</Heading>
				<VerticalSpacer eightPx />
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
				<VerticalSpacer twentyPx />
				<AvdelingslederDashboard>
					<div>
						<div className={styles.tabs}>
							<ul className={styles.tabList}>
								{[
									AvdelingslederPanels.BEHANDLINGSKOER_V3,
									AvdelingslederPanels.LAGREDE_SØK,
									AvdelingslederPanels.NOKKELTALL,
									AvdelingslederPanels.RESERVASJONER,
									AvdelingslederPanels.SAKSBEHANDLERE,
								].map((panel) => {
									const { label, aktiv, linkCreator } = getTab(
										panel,
										activeAvdelingslederPanel,
										getAvdelingslederPanelLocation,
									);
									return (
										<li key={panel} className={styles.tabOuter} role="presentation">
											{linkCreator({
												className: classNames('tabInner', {
													tabInnerAktiv: aktiv,
													tabInnerInteraktiv: !aktiv,
												}),
												children: <div className={styles.tabLabelOuter}>{label}</div>,
											})}
										</li>
									);
								})}
							</ul>
						</div>
						<Box background="raised" borderRadius="4" className={styles.panelPadding}>
							{renderAvdelingslederPanel(activeAvdelingslederPanel)}
						</Box>
					</div>
				</AvdelingslederDashboard>
			</div>
		);
	}
	return <LoadingPanel />;
};

export default AvdelingslederIndex;
