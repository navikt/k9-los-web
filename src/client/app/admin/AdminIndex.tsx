import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router';
import classnames from 'classnames/bind';
import Panel from 'nav-frontend-paneler';
import Tabs from 'nav-frontend-tabs';
import { Heading } from '@navikt/ds-react';
import useTrackRouteParam from 'app/data/trackRouteParam';
import { getPanelLocationCreator } from 'app/paths';
import { useInnloggetSaksbehandler } from 'api/queries/saksbehandlerQueries';
import LoadingPanel from 'sharedComponents/LoadingPanel';
import { parseQueryString } from 'utils/urlUtils';
import AdminPanels from './AdminPanels';
import * as styles from './adminIndex.css';
import AdminDashboard from './components/AdminDashboard';
import IkkeTilgangTilAvdelingslederPanel from './components/IkkeTilgangTilAvdelingslederPanel';
import DriftsmeldingerPanel from './driftsmeldinger/DriftsmeldingerPanel';

const classNames = classnames.bind(styles);

const renderPanel = (avdelingslederPanel) => {
	if (avdelingslederPanel === AdminPanels.DRIFTSMELDINGER) {
		return <DriftsmeldingerPanel />;
	}
	return null;
};

const messageId = {
	[AdminPanels.DRIFTSMELDINGER]: 'AdminIndex.Driftsmeldinger',
};

const getTab = (avdelingslederPanel, activeAvdelingslederPanel, getDriftsmeldingerPanelLocation) => ({
	label: (
		<Heading size="small">
			<FormattedMessage id={messageId[avdelingslederPanel]} />
		</Heading>
	),
	aktiv: avdelingslederPanel === activeAvdelingslederPanel,

	linkCreator: ({ children, className }) => (
		<NavLink
			to={getDriftsmeldingerPanelLocation(avdelingslederPanel)}
			className={classNames(className, 'link', { isActive: activeAvdelingslederPanel === avdelingslederPanel })}
		>
			{children}
		</NavLink>
	),
});

const hentPanelFromUrlOrDefault = (location) => {
	const panelFromUrl = parseQueryString(location.search);
	return panelFromUrl.avdelingsleder ? panelFromUrl.avdelingsleder : AdminPanels.DRIFTSMELDINGER;
};

/**
 * AdminIndex
 */
export const AdminIndex: FunctionComponent = () => {
	const { selected: activePanelTemp, location } = useTrackRouteParam({
		paramName: 'fane',
		isQueryParam: true,
	});
	const getDriftsmeldingerPanelLocation = getPanelLocationCreator(location);
	const activePanel = activePanelTemp || hentPanelFromUrlOrDefault(location);

	const { data: saksbehandler } = useInnloggetSaksbehandler();

	if (!saksbehandler.kanDrifte) {
		return <IkkeTilgangTilAvdelingslederPanel />;
	}
	if (activePanel) {
		return (
			<AdminDashboard key={activePanel}>
				<div>
					<Tabs tabs={[getTab(AdminPanels.DRIFTSMELDINGER, activePanel, getDriftsmeldingerPanelLocation)]} />
					<Panel className={styles.panelPadding}>{renderPanel(activePanel)}</Panel>
				</div>
			</AdminDashboard>
		);
	}
	return <LoadingPanel />;
};

export default AdminIndex;
