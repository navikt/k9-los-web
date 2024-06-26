import React, { FunctionComponent } from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import { Column } from 'nav-frontend-grid';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import Modal from 'sharedComponents/Modal';
import { Saksbehandler } from '../saksbehandlerTsType';
import * as styles from './sletteSaksbehandlerModal.css';

type OwnProps = Readonly<{
	valgtSaksbehandler: Saksbehandler;
	closeSletteModal: () => void;
	fjernSaksbehandler: (epost: string) => void;
}>;

/**
 * SletteSaksbehandlerModal
 *
 * Presentasjonskomponent. Modal som lar en avdelingsleder fjerne tilgjengelige saksbehandlere.
 */
const SletteSaksbehandlerModal: FunctionComponent<OwnProps & WrappedComponentProps> = ({
	intl,
	valgtSaksbehandler,
	closeSletteModal,
	fjernSaksbehandler,
}) => (
	<Modal
		closeButton={false}
		isOpen
		contentLabel={intl.formatMessage({ id: 'SletteSaksbehandlerModal.SletteModal' })}
		onRequestClose={closeSletteModal}
	>
		<div className={styles.text}>
			<Normaltekst>
				<FormattedMessage
					id="SletteSaksbehandlerModal.SletteSaksbehandler"
					values={{ saksbehandlerNavn: valgtSaksbehandler.navn || valgtSaksbehandler.epost }}
				/>
			</Normaltekst>
		</div>
		<div className={styles.buttons}>
			<Column>
				<Knapp mini htmlType="reset" onClick={closeSletteModal}>
					{intl.formatMessage({ id: 'SletteSaksbehandlerModal.Nei' })}
				</Knapp>
			</Column>
			<Column xs="4">
				<Hovedknapp mini htmlType="submit" onClick={() => fjernSaksbehandler(valgtSaksbehandler.epost)} autoFocus>
					{intl.formatMessage({ id: 'SletteSaksbehandlerModal.Ja' })}
				</Hovedknapp>
			</Column>
		</div>
	</Modal>
);

export default injectIntl(SletteSaksbehandlerModal);
