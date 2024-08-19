import React, { FunctionComponent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router';
import Endringslogg from '@navikt/familie-endringslogg';
import { BoxedListWithLinks, Header, Popover, SystemButton, UserPanel } from '@navikt/ft-plattform-komponenter';
import DriftsmeldingPanel from 'app/components/DriftsmeldingPanel';
import ErrorFormatter from 'app/feilhandtering/ErrorFormatter';
import NavAnsatt from 'app/navAnsattTsType';
import { RETTSKILDE_URL, SHAREPOINT_URL } from 'api/eksterneLenker';
import useRestApiError from 'api/error/useRestApiError';
import useRestApiErrorDispatcher from 'api/error/useRestApiErrorDispatcher';
import { K9LosApiKeys, RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import { useGlobalStateRestApiData } from 'api/rest-api-hooks';
import useRestApi from 'api/rest-api-hooks/src/local-data/useRestApi';
import { Driftsmelding } from '../../admin/driftsmeldinger/driftsmeldingTsType';
import ErrorMessagePanel from './ErrorMessagePanel';
import * as styles from './headerWithErrorPanel.css';

interface OwnProps {
	queryStrings: {
		errormessage?: string;
		errorcode?: string;
	};
	crashMessage?: string;
}

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
const HeaderWithErrorPanel: FunctionComponent<OwnProps> = ({ queryStrings, crashMessage }) => {
	const [erLenkePanelApent, setLenkePanelApent] = useState(false);
	const [erAvdelingerPanelApent, setAvdelingerPanelApent] = useState(false);
	const navigate = useNavigate();
	const intl = useIntl();

	const navAnsatt = useGlobalStateRestApiData<NavAnsatt>(RestApiGlobalStatePathsKeys.NAV_ANSATT);
	const { data: driftsmeldinger = [] } = useRestApi<Driftsmelding[]>(K9LosApiKeys.DRIFTSMELDINGER);

	const errorMessages = useRestApiError() || [];

	const formaterteFeilmeldinger = useMemo(
		() => new ErrorFormatter().format(errorMessages, crashMessage),
		[errorMessages],
	);
	const { removeErrorMessage } = useRestApiErrorDispatcher();
	const wrapperRef = useOutsideClickEvent(
		erLenkePanelApent,
		erAvdelingerPanelApent,
		setLenkePanelApent,
		setAvdelingerPanelApent,
	);
	const brukerPanel = <UserPanel name={navAnsatt.navn} />;
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

	const visAvdelingslederKnapp = (): boolean => {
		if (!navAnsatt.kanOppgavestyre) {
			return false;
		}
		if (navAnsatt.kanOppgavestyre && window.location.href.includes('avdelingsleder')) {
			return false;
		}
		return true;
	};

	const visAdminKnapp = (): boolean => {
		if (!navAnsatt.kanDrifte) {
			return false;
		}
		if (navAnsatt.kanDrifte && window.location.href.includes('admin')) {
			return false;
		}
		return true;
	};

	const popperPropsChildren = useCallback(
		() => (
			<BoxedListWithLinks
				onClick={() => {
					setLenkePanelApent(false);
				}}
				items={[
					{
						name: intl.formatMessage({ id: 'Header.Rettskilde' }),
						href: RETTSKILDE_URL,
						isExternal: true,
					},
					{
						name: intl.formatMessage({ id: 'Header.Sharepoint' }),
						href: SHAREPOINT_URL,
						isExternal: true,
					},
				]}
			/>
		),
		[],
	);

	const referencePropsChildren = useCallback(
		({ ref }) => (
			<div ref={ref}>
				<SystemButton
					onClick={() => {
						if (erAvdelingerPanelApent) {
							setAvdelingerPanelApent(false);
						}
						setLenkePanelApent(!erLenkePanelApent);
					}}
					isToggled={erLenkePanelApent}
				/>
			</div>
		),
		[erLenkePanelApent],
	);

	return (
		<header ref={fixedHeaderRef} className={`${styles.container} ${isDev ? styles.containerDev : ''}`}>
			<div ref={wrapperRef}>
				<Header title={intl.formatMessage({ id: 'Header.K9Los' })} changeLocation={goToHomepage}>
					{visAdminKnapp() && (
						<button type="button" className={styles.knapp} onClick={goTilDriftsmeldingerPanel}>
							Driftsmeldinger
						</button>
					)}
					{visAvdelingslederKnapp() && (
						<button type="button" className={styles.knapp} onClick={goTilAvdelingslederPanel}>
							Avdelingslederpanel
						</button>
					)}
					{/*
            Går mot en backend som foreldrepenger styrer.
            https://github.com/navikt/familie-endringslogg
            For å nå backend lokalt må man være tilkoblet naisdevice og kjøre opp k9-sak-web på port 8000 pga CORS
            */}
					{navAnsatt?.brukerIdent && window.location.hostname.includes('nav') && (
						<div className={styles['endringslogg-container']}>
							<Endringslogg
								userId={navAnsatt.brukerIdent}
								appId="K9_SAK"
								appName="K9 Sak"
								backendUrl={
									isDev
										? 'https://familie-endringslogg.intern.dev.nav.no'
										: 'https://familie-endringslogg.intern.nav.no'
								}
								stil="lys"
								alignLeft
								maxEntries={20}
							/>
						</div>
					)}
					<Popover
						popperIsVisible={erLenkePanelApent}
						renderArrowElement
						customPopperStyles={{ top: '11px', zIndex: 1 }}
						popperProps={{
							children: popperPropsChildren,
							placement: 'bottom-start',
							strategy: 'fixed',
						}}
						referenceProps={{
							// eslint-disable-next-line react/prop-types
							children: referencePropsChildren,
						}}
					/>
					{brukerPanel}
					{isDev && (
						<button type="button" className={styles.knapp} onClick={loggUt}>
							Logg ut
						</button>
					)}
				</Header>
			</div>
			<DriftsmeldingPanel driftsmeldinger={driftsmeldinger} />
			<ErrorMessagePanel
				errorMessages={formaterteFeilmeldinger}
				queryStrings={queryStrings}
				removeErrorMessages={removeErrorMessage}
			/>
		</header>
	);
};

export default HeaderWithErrorPanel;
