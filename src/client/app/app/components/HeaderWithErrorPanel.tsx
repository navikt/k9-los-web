import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { MenuGridIcon } from '@navikt/aksel-icons';
import { ActionMenu, InternalHeader, Spacer } from '@navikt/ds-react';
import Endringslogg from '@navikt/familie-endringslogg';
import DriftsmeldingPanel from 'app/components/DriftsmeldingPanel';
import { useInnloggetSaksbehandler } from 'api/queries/saksbehandlerQueries';
import * as styles from './headerWithErrorPanel.css';

const isDev = !window.location.hostname.includes('intern.nav.no');

const useOutsideClickEvent = (
	erLenkepanelApent,
	erAvdelingerPanelApent,
	setLenkePanelApent,
	setAvdelingerPanelApent,
) => {
	const wrapperRef = useRef(null);
	const handleClickOutside = useCallback(
		(event) => {
			if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
				setLenkePanelApent(false);
				setAvdelingerPanelApent(false);
			}
		},
		[wrapperRef.current],
	);

	useEffect(() => {
		if (erLenkepanelApent || erAvdelingerPanelApent) {
			document.addEventListener('mousedown', handleClickOutside);
		} else {
			document.removeEventListener('mousedown', handleClickOutside);
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [erLenkepanelApent, erAvdelingerPanelApent]);

	return wrapperRef;
};

/**
 * HeaderWithErrorPanel
 *
 * Presentasjonskomponent. Definerer header-linjen som alltid vises øverst nettleservinduet.
 * Denne viser lenke tilbake til hovedsiden, nettside-navnet og NAV-ansatt navn.
 * I tillegg vil den vise potensielle feilmeldinger i ErrorMessagePanel.
 */
const HeaderWithErrorPanel: FunctionComponent = () => {
	const [erLenkePanelApent, setLenkePanelApent] = useState(false);
	const [erAvdelingerPanelApent, setAvdelingerPanelApent] = useState(false);
	const navigate = useNavigate();

	const { data: innloggetSaksbehandler } = useInnloggetSaksbehandler();

	const wrapperRef = useOutsideClickEvent(
		erLenkePanelApent,
		erAvdelingerPanelApent,
		setLenkePanelApent,
		setAvdelingerPanelApent,
	);
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
		<header ref={fixedHeaderRef} className={`${styles.container} ${isDev ? styles.containerDev : ''}`}>
			<div ref={wrapperRef}>
				<InternalHeader>
					<InternalHeader.Title
						as="a"
						href="/"
						onClick={(e) => {
							e.preventDefault();
							goToHomepage();
						}}
					>
						Nav Pleiepenger og omsorgspenger
					</InternalHeader.Title>
					<Spacer />
					{visDriftsmeldingerKnapp && (
						<button type="button" className={styles.knapp} onClick={goTilDriftsmeldingerPanel}>
							Driftsmeldinger
						</button>
					)}
					{visAvdelingslederKnapp && (
						<button type="button" className={styles.knapp} onClick={goTilAvdelingslederPanel}>
							Avdelingslederpanel
						</button>
					)}
					{innloggetSaksbehandler?.brukerIdent && window.location.hostname.includes('nav') && (
						<div className={styles['endringslogg-container']}>
							<Endringslogg
								userId={innloggetSaksbehandler?.brukerIdent}
								appId="K9_SAK"
								appName="K9 Sak"
								backendUrl={
									isDev
										? 'https://familie-endringslogg.intern.dev.nav.no'
										: 'https://familie-endringslogg.intern.nav.no'
								}
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
					<InternalHeader.User className="text-white" name={innloggetSaksbehandler?.brukerIdent} />
					{isDev && (
						<button type="button" className={styles.knapp} onClick={loggUt}>
							Logg ut
						</button>
					)}
				</InternalHeader>
			</div>
			<DriftsmeldingPanel />
		</header>
	);
};

export default HeaderWithErrorPanel;
