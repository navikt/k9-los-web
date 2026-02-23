import React, { FunctionComponent, useRef } from 'react';
import { useNavigate } from 'react-router';
import { MenuGridIcon } from '@navikt/aksel-icons';
import { ActionMenu, InternalHeader, Spacer } from '@navikt/ds-react';
import Endringslogg from '@navikt/familie-endringslogg';
import DriftsmeldingPanel from 'app/components/DriftsmeldingPanel';
import { useInnloggetSaksbehandler } from 'api/queries/saksbehandlerQueries';
import * as styles from './headerWithErrorPanel.css';

const isDev = !window.location.hostname.includes('intern.nav.no');

const endringsloggBackendUrl = (() => {
	// I påvente av oppsett for proxy settes url direkte her
	if (window.location.hostname.includes('localhost')) {
		return '/api/endringslogg';
	} else if (window.location.hostname.includes('dev')) {
		return 'https://familie-endringslogg.intern.dev.nav.no';
	} else {
		return 'https://familie-endringslogg.intern.nav.no';
	}
})();

const HeaderWithErrorPanel: FunctionComponent = () => {
	const navigate = useNavigate();

	const { data: innloggetSaksbehandler } = useInnloggetSaksbehandler();

	const fixedHeaderRef = useRef(null);

	const goTilAvdelingslederPanel = () => {
		navigate('/avdelingsleder');
	};

	const goTilDriftsmeldingerPanel = () => {
		navigate('/admin');
	};

	const goToHomepage = () => {
		navigate('/');
	};

	const loggUt = () => {
		window.location.assign('/logout');
		setTimeout(() => {
			goToHomepage();
		}, 1000);
	};

	const visAvdelingslederKnapp =
		innloggetSaksbehandler?.kanOppgavestyre && !window.location.href.includes('avdelingsleder');

	const visDriftsmeldingerKnapp = innloggetSaksbehandler?.kanDrifte && !window.location.href.includes('admin');

	return (
		<header ref={fixedHeaderRef} className={isDev ? styles.containerDev : ''}>
			<InternalHeader>
				<InternalHeader.Title
					as="a"
					href="/"
					onClick={(e) => {
						e.preventDefault();
						goToHomepage();
					}}
				>
					Pleiepenger, Omsorgspenger og Opplæringspenger
				</InternalHeader.Title>
				<Spacer />
				{visDriftsmeldingerKnapp && (
					<InternalHeader.Button onClick={goTilDriftsmeldingerPanel}>Driftsmeldinger</InternalHeader.Button>
				)}
				{visAvdelingslederKnapp && (
					<InternalHeader.Button onClick={goTilAvdelingslederPanel}>Avdelingslederpanel</InternalHeader.Button>
				)}
				{innloggetSaksbehandler?.brukerIdent && (
					<div className={styles['endringslogg-container']}>
						<Endringslogg
							userId={innloggetSaksbehandler?.brukerIdent}
							appId="K9_SAK"
							appName="K9 Sak"
							backendUrl={endringsloggBackendUrl}
							stil="lys"
							alignLeft
							maxEntries={150}
						/>
					</div>
				)}
				<ActionMenu>
					<ActionMenu.Trigger>
						<InternalHeader.Button>
							<MenuGridIcon fontSize="1.5rem" title="Systemer og oppslagsverk" />
						</InternalHeader.Button>
					</ActionMenu.Trigger>
					<ActionMenu.Content>
						<ActionMenu.Group label="Systemer og oppslagsverk">
							<ActionMenu.Item>
								<a href="https://lovdata.no/pro/sso/login/nav" target="_blank" rel="noopener noreferrer">
									Rettskilde
								</a>
							</ActionMenu.Item>
							<ActionMenu.Item>
								<a
									href="https://navno.sharepoint.com/sites/44/NAYSykdomifamilien/SitePages/Hjem.aspx"
									target="_blank"
									rel="noopener noreferrer"
								>
									Sharepoint
								</a>
							</ActionMenu.Item>
						</ActionMenu.Group>
					</ActionMenu.Content>
				</ActionMenu>
				<InternalHeader.User name={innloggetSaksbehandler?.brukerIdent} />
				{isDev && (
					<InternalHeader.Button type="button" onClick={loggUt}>
						Logg ut
					</InternalHeader.Button>
				)}
			</InternalHeader>
			<DriftsmeldingPanel />
		</header>
	);
};

export default HeaderWithErrorPanel;
