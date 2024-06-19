import React, { useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { OppgaveNøkkel } from 'types/OppgaveNøkkel';
import OppgaveV3 from 'types/OppgaveV3';
import ReservasjonV3Dto from 'saksbehandler/behandlingskoer/ReservasjonV3Dto';
import Oppgave from 'saksbehandler/oppgaveTsType';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import FlyttReservasjonerModal from './FlyttReservasjonerModal';
import MenuButton from './MenuButton';
import OpphevReservasjonerModal from './OpphevReservasjonerModal';
import * as styles from './oppgaveHandlingerMenu.css';

const toggleEventListeners = (turnOnEventListeners, handleOutsideClick) => {
	if (turnOnEventListeners) {
		document.addEventListener('click', handleOutsideClick, false);
		document.addEventListener('mousedown', handleOutsideClick, false);
		document.addEventListener('keydown', handleOutsideClick, false);
	} else {
		document.removeEventListener('click', handleOutsideClick, false);
		document.removeEventListener('mousedown', handleOutsideClick, false);
		document.removeEventListener('keydown', handleOutsideClick, false);
	}
};

interface OwnProps {
	toggleMenu: (valgtOppgave: Oppgave | OppgaveV3) => void;
	oppgave: Oppgave | OppgaveV3;
	reservasjon: ReservasjonV3Dto;
	imageNode: HTMLElement | undefined;
	forlengOppgaveReservasjon: (oppgaveNøkkel: OppgaveNøkkel) => void;
}

/**
 * @deprecated
 */
const OppgaveHandlingerMenu: React.FC<OwnProps> = ({
	toggleMenu,
	oppgave,
	imageNode,
	forlengOppgaveReservasjon,
	reservasjon,
}) => {
	const node = useRef(null);
	const menuButtonRef = useRef(null);

	const [showOpphevReservasjonModal, setShowOpphevReservasjonModal] = useState(false);
	const [showFlyttReservasjonModal, setShowFlyttReservasjonModal] = useState(false);

	const handleOutsideClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		if (event && event.target) {
			const harKlikketMeny = node.current && node.current.contains(event.target as Node);
			const harKlikketIkon = imageNode && imageNode.contains(event.target as Node);
			if (harKlikketMeny || harKlikketIkon || showOpphevReservasjonModal || showFlyttReservasjonModal) {
				return;
			}
		}
		toggleMenu(null);
	};

	useEffect(() => {
		if (menuButtonRef && menuButtonRef.current) {
			menuButtonRef.current.focus();
		}
		toggleEventListeners(true, handleOutsideClick);
		return () => {
			toggleEventListeners(false, handleOutsideClick);
		};
	}, []);

	const showBegrunnelseModal = () => {
		toggleEventListeners(false, handleOutsideClick);
		setShowOpphevReservasjonModal(true);
	};

	const closeBegrunnelseModal = () => {
		toggleMenu(null);
		toggleEventListeners(true, handleOutsideClick);
		setShowOpphevReservasjonModal(false);
	};

	const showFlytteModal = () => {
		toggleEventListeners(false, handleOutsideClick);
		setShowFlyttReservasjonModal(true);
	};

	const closeFlytteModal = () => {
		toggleMenu(null);
		setShowFlyttReservasjonModal(false);
	};

	const forlengReserverasjon = () => {
		forlengOppgaveReservasjon(oppgave.oppgaveNøkkel);
		toggleMenu(null);
	};

	return (
		<>
			<div className={styles.containerMenu} ref={node}>
				<VerticalSpacer eightPx />
				<MenuButton onClick={showBegrunnelseModal} ref={menuButtonRef}>
					<FormattedMessage id="OppgaveHandlingerMenu.LeggTilbake" values={{ br: <br /> }} />
				</MenuButton>
				<MenuButton onClick={forlengReserverasjon}>
					<FormattedMessage id="OppgaveHandlingerMenu.ForlengReservasjon" values={{ br: <br /> }} />
				</MenuButton>
				<MenuButton onClick={showFlytteModal}>
					<FormattedMessage id="OppgaveHandlingerMenu.FlyttReservasjon" values={{ br: <br /> }} />
				</MenuButton>
			</div>
			{showOpphevReservasjonModal && (
				<OpphevReservasjonerModal
					oppgaveNøkler={[oppgave.oppgaveNøkkel]}
					open={showOpphevReservasjonModal}
					closeModal={closeBegrunnelseModal}
				/>
			)}

			{showFlyttReservasjonModal && (
				<FlyttReservasjonerModal
					reservasjoner={[
						{
							oppgaveNøkkel: oppgave.oppgaveNøkkel,
							begrunnelse: reservasjon.kommentar,
							reservertTil: reservasjon.reservertTil,
							reservertAvIdent: reservasjon.reservertAvIdent,
						},
					]}
					open={showFlyttReservasjonModal}
					closeModal={closeFlytteModal}
				/>
			)}
		</>
	);
};

export default OppgaveHandlingerMenu;
